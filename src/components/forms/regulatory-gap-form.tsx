'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postJson } from '@/lib/api/post-json';
import { fetchPaginated } from '@/lib/api/fetch-json';
import { API_V1, type CreditOperation } from '@/lib/types/rails-entities';
import { Field, inputCls } from '@/components/ui/field';
import { SearchSelect } from '@/components/ui/search-select';
import { regulatoryGapSeverity, regulatoryGapStatus, t } from '@/lib/i18n/status';

const SEVERITIES = Object.keys(regulatoryGapSeverity);
const STATUSES = Object.keys(regulatoryGapStatus);

export function RegulatoryGapForm() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [opQuery, setOpQuery] = useState('');
  const [opDebounced, setOpDebounced] = useState('');

  useEffect(() => {
    if (opQuery.length < 3) { setOpDebounced(''); return; }
    const id = setTimeout(() => setOpDebounced(opQuery), 300);
    return () => clearTimeout(id);
  }, [opQuery]);

  const { data: opsPage, isFetching: loadingOps } = useQuery({
    queryKey: ['credit_operations', 'autocomplete', opDebounced],
    queryFn: () => fetchPaginated<CreditOperation>(`${API_V1}/credit_operations`, {
      page: 1, perPage: 10, extra: { q: opDebounced },
    }),
    enabled: opDebounced.length >= 3,
    staleTime: 30_000,
  });

  const operationOptions = (opsPage?.data ?? []).map((op) => ({
    value: String(op.id),
    label: `#${op.id} — ${op.originator?.legal_name ?? op.originator_id}`,
    sublabel: op.receivable?.reference_number,
  }));

  const form = useForm({
    defaultValues: {
      credit_operation_id: '',
      area: '',
      code: '',
      description: '',
      severity: 'medium',
      status: 'open',
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await postJson(`${API_V1}/regulatory_gaps`, {
          regulatory_gap: {
            credit_operation_id: value.credit_operation_id ? Number(value.credit_operation_id) : null,
            area: value.area,
            code: value.code || null,
            description: value.description || null,
            severity: value.severity,
            status: value.status,
          },
        });
        await queryClient.invalidateQueries({ queryKey: ['regulatory_gaps'] });
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
        {open ? '✕ Fechar' : '+ Novo Gap'}
      </button>

      {open && (
        <form
          onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}
          className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <form.Field name="credit_operation_id">
              {(field) => (
                <Field label="Operação de Crédito (opcional)">
                  <SearchSelect
                    options={operationOptions}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onQueryChange={setOpQuery}
                    isLoading={loadingOps}
                    placeholder="Buscar operação…"
                    nullable
                    nullLabel="Nenhuma"
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="area" validators={{ onChange: ({ value }) => !value ? 'Obrigatório' : undefined }}>
              {(field) => (
                <Field label="Área" error={field.state.meta.errors[0]?.toString()}>
                  <input className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                </Field>
              )}
            </form.Field>

            <form.Field name="code">
              {(field) => (
                <Field label="Código">
                  <input className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>

            <form.Field name="severity">
              {(field) => (
                <Field label="Severidade">
                  <select className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                    {SEVERITIES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </select>
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

            <form.Field name="description">
              {(field) => (
                <Field label="Descrição">
                  <input className={inputCls} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
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
