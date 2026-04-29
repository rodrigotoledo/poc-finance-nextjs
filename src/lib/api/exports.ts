import { getApiBaseUrl } from './config';

export type ExportRange = 'today' | 'yesterday' | 'week' | 'month';
export type ExportEntity =
  | 'originators'
  | 'receivables'
  | 'credit_operations'
  | 'regulatory_gaps'
  | 'imports'
  | 'events';

export async function requestExportCsv(opts: {
  entity: ExportEntity;
  range: ExportRange;
  deliverToEmail?: string;
}): Promise<{ id: number; status: string }> {
  const url = `${getApiBaseUrl()}/api/v2/exports`;
  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      entity: opts.entity,
      range: opts.range,
      deliver_to_email: opts.deliverToEmail,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<{ id: number; status: string }>;
}

