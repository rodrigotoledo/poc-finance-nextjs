import { getApiBaseUrl } from "./config";
import type { PaginatedResponse } from "@/lib/types/pagination";

export async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
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

export function buildListQuery(params: {
  page: number;
  perPage: number;
  extra?: Record<string, string | number | undefined>;
}): string {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("per_page", String(params.perPage));
  if (params.extra) {
    Object.entries(params.extra).forEach(([k, v]) => {
      if (v !== undefined && v !== "") sp.set(k, String(v));
    });
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

/** Listagens paginadas: `{ data, meta }` da API Rails (Pagy). */
export async function fetchPaginated<T>(
  path: string,
  opts: { page: number; perPage: number; extra?: Record<string, string | number | undefined> },
): Promise<PaginatedResponse<T>> {
  const qs = buildListQuery(opts);
  return fetchJson<PaginatedResponse<T>>(`${path}${qs}`);
}

/** Percorre todas as páginas até `perPage` máximo da API (100) — útil para selects. */
export async function fetchAllPaginated<T>(
  path: string,
  perPage = 100,
  maxPages = 50,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  for (let i = 0; i < maxPages; i++) {
    const r = await fetchPaginated<T>(path, { page, perPage });
    all.push(...r.data);
    if (page >= r.meta.total_pages) break;
    page += 1;
  }
  return all;
}
