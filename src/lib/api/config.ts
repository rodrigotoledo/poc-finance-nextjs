/**
 * Browser:  NEXT_PUBLIC_RAILS_URL  (ex.: http://localhost:3000)
 * Servidor: RAILS_INTERNAL_URL     (ex.: http://app:3000) para SSR falar com Rails na mesma rede Docker.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_RAILS_URL ?? "http://localhost:3000";
  }
  return (
    process.env.RAILS_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_RAILS_URL ??
    "http://localhost:3000"
  );
}
