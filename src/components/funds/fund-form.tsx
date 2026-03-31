'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { postJson } from '@/lib/api/post-json';
import { API_V1 } from '@/lib/types/rails-entities';
import { Field, inputCls } from '@/components/ui/field';
import { useTUI } from '@/i18n/client';
import { fundStatus } from '@/lib/i18n/status';

function reaisToCents(value: string): number {
  const parsed = Number(value.replace(/\s/g, '').replace(',', '.'));
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

function fieldErr(errors: unknown[]): string | undefined {
  const first = errors[0];
  return first != null ? String(first) : undefined;
}

export function FundForm() {
  const tu = useTUI();
  const [formOpen, setFormOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: '',
      fund_type: '',
      status: 'active',
      total_commitment_reais: '',
      allocated_reais: '0',
      available_reais: '',
      target_return_rate: '',
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const fundPayload: Record<string, unknown> = {
        name: value.name,
        status: value.status,
        allocated_amount_cents: reaisToCents(value.allocated_reais || '0'),
      };
      if (value.fund_type.trim()) fundPayload.fund_type = value.fund_type.trim();
      if (value.total_commitment_reais.trim()) {
        fundPayload.total_commitment_cents = reaisToCents(value.total_commitment_reais);
      }
      if (value.available_reais.trim()) {
        fundPayload.available_amount_cents = reaisToCents(value.available_reais);
      }
      if (value.target_return_rate.trim()) {
        fundPayload.target_return_rate = value.target_return_rate.trim();
      }

      try {
        await postJson(`${API_V1}/funds`, { fund: fundPayload });
        await queryClient.invalidateQueries({ queryKey: ['funds'] });
        form.reset();
        setFormOpen(false);
      } catch (error) {
        setServerError(error instanceof Error ? error.message : String(error));
      }
    },
  });

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => {
          setFormOpen((open) => !open);
          setServerError(null);
          form.reset();
        }}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {formOpen ? tu('funds.form.close') : tu('funds.form.open')}
      </button>

      {formOpen && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tu('funds.form.title')}</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{ onChange: ({ value }) => (!value ? tu('common.required') : undefined) }}
            >
              {(field) => (
                <Field label={tu('funds.form.fields.name')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="fund_type">
              {(field) => (
                <Field label={tu('funds.form.fields.fundType')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={tu('common.optional')}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <Field label={tu('funds.form.fields.status')} error={fieldErr(field.state.meta.errors)}>
                  <select
                    className={inputCls}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  >
                    <option value="active">{fundStatus.active}</option>
                    <option value="closed">{fundStatus.closed}</option>
                    <option value="winding_up">{fundStatus.winding_up}</option>
                  </select>
                </Field>
              )}
            </form.Field>

            <form.Field name="target_return_rate">
              {(field) => (
                <Field label={tu('funds.form.fields.targetReturn')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    type="text"
                    inputMode="decimal"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={tu('funds.form.fields.targetReturnPlaceholder')}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="total_commitment_reais">
              {(field) => (
                <Field label={tu('funds.form.fields.totalCommitment')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    inputMode="decimal"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={tu('common.optional')}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="allocated_reais">
              {(field) => (
                <Field label={tu('funds.form.fields.allocated')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    inputMode="decimal"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="available_reais">
              {(field) => (
                <Field label={tu('funds.form.fields.available')} error={fieldErr(field.state.meta.errors)}>
                  <input
                    className={inputCls}
                    inputMode="decimal"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={tu('common.optional')}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          {serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}

          <div className="mt-3 flex gap-2">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {isSubmitting ? tu('funds.form.saving') : tu('funds.form.submit')}
                </button>
              )}
            </form.Subscribe>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setServerError(null);
                form.reset();
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {tu('common.cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
