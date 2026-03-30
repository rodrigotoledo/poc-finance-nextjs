import { getNestBaseUrl } from "./nest-config";

export async function fetchNestJson<T>(path: string): Promise<T> {
  const url = `${getNestBaseUrl()}${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export function buildNestQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === "") return;
    sp.set(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}

