/**
 * Browser:  NEXT_PUBLIC_NEST_URL  (ex.: http://localhost:4000)
 * Servidor: NEST_INTERNAL_URL     (ex.: http://nest:4000) para SSR na rede Docker.
 */
export function getNestBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_NEST_URL ?? "http://localhost:4000";
  }
  return (
    process.env.NEST_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_NEST_URL ??
    "http://localhost:4000"
  );
}

