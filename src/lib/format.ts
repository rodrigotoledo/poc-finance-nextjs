/** Formata 14 dígitos como CNPJ: XX.XXX.XXX/XXXX-XX */
export function formatCnpj(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function formatBrlFromCents(cents: number): string {
  if (!Number.isFinite(cents)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Valor exato em BRL (para tooltip / acessibilidade). */
export function formatBrlFromCentsFull(cents: number | null | undefined): string {
  if (cents == null || !Number.isFinite(cents)) {
    return "—";
  }
  return formatBrlFromCents(cents);
}

/**
 * A partir de 1 bilhão de reais usa formato curto "bi"; abaixo disso mantém o valor completo.
 * O valor exato em BRL fica em `title` para hover (quando abreviado).
 */
export function formatBrlFromCentsHuman(cents: number | null | undefined): {
  display: string;
  /** Texto completo para `title` / screen readers; igual a `display` se não abreviar. */
  title: string;
} {
  const full = formatBrlFromCentsFull(cents);
  if (cents == null || !Number.isFinite(cents)) {
    return { display: "—", title: "" };
  }

  const reais = cents / 100;
  const abs = Math.abs(reais);
  const sign = reais < 0 ? "-" : "";

  if (abs < 1_000_000_000) {
    return { display: full, title: full };
  }

  const fmt = (value: number) =>
    value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

  const display = `${sign}$${fmt(abs / 1_000_000_000)}B`;
  return { display, title: full };
}

/** Fuso fixo para SSR e cliente renderizarem a mesma string (evita hydration mismatch). */
const DISPLAY_TZ = "America/Sao_Paulo";

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: DISPLAY_TZ,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
