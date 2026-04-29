'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { getApiBaseUrl } from '@/lib/api/config';
import { API_V1, type Originator } from '@/lib/types/rails-entities';
import { Field, inputCls } from '@/components/ui/field';
import { SearchSelect } from '@/components/ui/search-select';
import { formatCnpj } from '@/lib/format';
import { useTranslations } from 'next-intl';

export function ImportForm() {
  const t = useTranslations('ui.importForm');
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Autocomplete originador
  const [originatorQuery, setOriginatorQuery] = useState('');
  const [originatorDebounced, setOriginatorDebounced] = useState('');
  const [originatorId, setOriginatorId] = useState('');

  useEffect(() => {
    if (originatorQuery.length < 3) { setOriginatorDebounced(''); return; }
    const id = setTimeout(() => setOriginatorDebounced(originatorQuery), 300);
    return () => clearTimeout(id);
  }, [originatorQuery]);

  const { data: originatorsPage, isFetching: loadingOriginators } = useQuery({
    queryKey: ['originators', 'autocomplete', originatorDebounced],
    queryFn: () => fetchPaginated<Originator>(`${API_V1}/originators`, {
      page: 1, perPage: 10, extra: { q: originatorDebounced },
    }),
    enabled: originatorDebounced.length >= 3,
    staleTime: 30_000,
  });

  const originatorOptions = (originatorsPage?.data ?? []).map((o) => ({
    value: String(o.id),
    label: o.legal_name,
    sublabel: formatCnpj(o.tax_id),
  }));

  const reset = () => {
    setOriginatorId('');
    setOriginatorQuery('');
    setOriginatorDebounced('');
    setServerError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setServerError('Selecione um arquivo.'); return; }

    setSubmitting(true);
    setServerError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (originatorId) fd.append('originator_id', originatorId);

      const res = await fetch(`${getApiBaseUrl()}${API_V1}/imports`, {
        method: 'POST',
        headers: { 
          Accept: 'application/json',
          'Idempotency-Key': crypto.randomUUID()
        },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string; errors?: string[] }).error
          ?? (data as { errors?: string[] }).errors?.join(', ')
          ?? res.statusText;
        throw new Error(msg);
      }

      await queryClient.invalidateQueries({ queryKey: ['imports'] });
      reset();
      setOpen(false);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => { setOpen((o) => !o); reset(); }}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {open ? t('close') : t('open')}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('file')}>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx"
                required
                className={inputCls}
              />
            </Field>

            <Field label={t('originator')}>
              <SearchSelect
                options={originatorOptions}
                value={originatorId}
                onChange={setOriginatorId}
                onQueryChange={setOriginatorQuery}
                isLoading={loadingOriginators}
                placeholder="Buscar originador…"
                nullable
                nullLabel="Nenhum"
              />
            </Field>
          </div>

          {serverError && (
            <p className="mt-2 text-sm text-red-600">{serverError}</p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
