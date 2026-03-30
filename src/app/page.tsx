import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const sections = [
  {
    href: "/dashboard",
    title: "Dashboard",
    text: "Estatísticas consolidadas e feed em tempo real do pregão via Redis.",
    highlight: true,
  },
  {
    href: "/originators",
    title: "Originadores",
    text: "Contrapartes no mercado de recebíveis (CNPJ, razão social).",
  },
  {
    href: "/receivables",
    title: "Recebíveis",
    text: "Títulos com valor em centavos, vencimento e status.",
  },
  {
    href: "/credit-operations",
    title: "Operações de crédito",
    text: "Operações ligadas a recebíveis e originadores.",
  },
  {
    href: "/regulatory-gaps",
    title: "Gaps regulatórios",
    text: "Rastreamento de lacunas de compliance (BACEN, etc.).",
  },
  {
    href: "/imports",
    title: "Importações",
    text: "Lotes CSV/XLSX processados em background.",
  },
];

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Console"
        description="Painel de controlo — Rails API v2 (OpenAPI 3.1)."
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className={`block rounded-xl border p-5 shadow-sm transition hover:shadow ${
                s.highlight
                  ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
              }`}
            >
              <h2 className="font-semibold">{s.title}</h2>
              <p className={`mt-1 text-sm ${s.highlight ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                {s.text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
