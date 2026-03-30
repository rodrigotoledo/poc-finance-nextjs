import { getApiBaseUrl } from './config';

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const messages = (data as { errors?: string[] }).errors?.join(', ') ?? res.statusText;
    throw new Error(messages);
  }
  return res.json() as Promise<T>;
}
