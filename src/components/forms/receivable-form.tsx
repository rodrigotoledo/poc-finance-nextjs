'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postJson } from '@/lib/api/post-json';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type Originator } from '@/lib/types/rails-entities';
import { Field, inputCls } from '@/components/ui/field';
import { SearchSelect } from '@/components/ui/search-select';
import { formatCnpj } from '@/lib/format';
import { receivableStatus, t } from '@/lib/i18n/status';

const STATUSES = Object.keys(receivableStatus);

function useAutocomplete<T>(path: string, queryKey: string) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    if (query.length < 3) { setDebounced(''); return; }
    const id = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: [queryKey, 'autocomplete', debounced],
    queryFn: () => fetchPaginated<T>(path, { page: 1, perPage: 10, extra: { q: debounced } }),
    enabled: debounced.length >= 3,
    staleTime: 30_000,
  });

  return { query, setQuery, options: data?.data ?? [], isFetching };
}

export function ReceivableForm() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const originators = useAutocomplete<Originator>(`${API_V1}/originators`, 'originators');

  const originatorOptions = originators.options.map((o) => ({
    value: String(o.id),
    label: o.legal_name,
    sublabel: formatCnpj(o.tax_id),
  }));

  const form = useForm({
    defaultValues: {
      originator_id: '',
      reference_number: '',
      amount_brl: '',
      due_on: '',
      status: 'pending',
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await postJson(`${API_V1}/receivables`, {
          receivable: {
            originator_id: Number(value.originator_id),
            reference_number: value.reference_number,
            amount_cents: Math.round(parseFloat(value.amount_brl) * 100),
            due_on: value.due_on,
            status: value.status,
          },
        });
        await queryClient.invalidateQueries({ queryKey: ['receivables'] });
        form.reset();
        setOpen(false);
      } catch (e) {
        setServerError(e instanceof Error ? e.message : String(e));
      }
    },
  });

  return (
    <div className="mb-4">
      <button
        onClick={() => { setOpen((o) => !o); setServerError(null); form.reset(); }}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {open ? '✕ Fechar' : '+ Novo Recebível'}
      </button>

      {open && (
        <form
          onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}
          className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <form.Field
              name="originator_id"
              validators={{ onChange: ({ value }) => !value ? 'Obrigatório' : undefined }}
            >
              {(field) => (
                <Field label="Originador" error={field.state.meta.errors[0]?.toString()}>
                  <SearchSelect
                    options={originatorOptions}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onQueryChange={originators.setQuery}
                    isLoading={originators.isFetching}
                    placeholder="Buscar originador…"
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="reference_number"
              validators={{ onChange: ({ value }) => !value ? 'Obrigatório' : undefined }}
            >
              {(field) => (
                <Field label="Referência" error={field.state.meta.errors[0]?.toString()}>
                  <input className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="amount_brl"
              validators={{ onChange: ({ value }) => !value || isNaN(parseFloat(value)) ? 'Valor inválido' : undefined }}
            >
              {(field) => (
                <Field label="Valor (USD)" error={field.state.meta.errors[0]?.toString()}>
                  <input type="number" step="0.01" min="0.01" className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="due_on"
              validators={{ onChange: ({ value }) => !value ? 'Obrigatório' : undefined }}
            >
              {(field) => (
                <Field label="Vencimento" error={field.state.meta.errors[0]?.toString()}>
                  <input type="date" className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                </Field>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <Field label="Status">
                  <select className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </select>
                </Field>
              )}
            </form.Field>
          </div>

          {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}

          <div className="mt-3 flex gap-2">
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
                  {isSubmitting ? 'Salvando…' : 'Salvar'}
                </button>
              )}
            </form.Subscribe>
            <button type="button" onClick={() => { setOpen(false); setServerError(null); form.reset(); }} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
