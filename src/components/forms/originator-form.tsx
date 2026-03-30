'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { postJson } from '@/lib/api/post-json';
import { API_V1 } from '@/lib/types/rails-entities';
import { formatCnpj } from '@/lib/format';
import { Field, inputCls } from '@/components/ui/field';

export function OriginatorForm() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { legal_name: '', tax_id: '' },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await postJson(`${API_V1}/originators`, {
          originator: { ...value, tax_id: value.tax_id.replace(/\D/g, "") },
        });
        await queryClient.invalidateQueries({ queryKey: ['originators'] });
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
        {open ? '✕ Fechar' : '+ Novo Originador'}
      </button>

      {open && (
        <form
          onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}
          className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <form.Field
              name="legal_name"
              validators={{ onChange: ({ value }) => !value ? 'Obrigatório' : undefined }}
            >
              {(field) => (
                <Field label="Razão Social" error={field.state.meta.errors[0]?.toString()}>
                  <input
                    className={inputCls}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="tax_id"
              validators={{
                onChange: ({ value }) => {
                  const digits = value.replace(/\D/g, "");
                  if (!digits) return "Obrigatório";
                  if (digits.length !== 14) return "CNPJ deve ter 14 dígitos";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field label="CNPJ" error={field.state.meta.errors[0]?.toString()}>
                  <input
                    className={inputCls}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(formatCnpj(e.target.value))}
                    onBlur={field.handleBlur}
                    maxLength={18}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}

          <div className="mt-3 flex gap-2">
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {isSubmitting ? 'Salvando…' : 'Salvar'}
                </button>
              )}
            </form.Subscribe>
            <button
              type="button"
              onClick={() => { setOpen(false); setServerError(null); form.reset(); }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
