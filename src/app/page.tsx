import { PageHeader } from "@/components/page-header";
import { tUI } from "@/lib/i18n/ui";
import Link from "next/link";

const sections = [
  {
    href: "/dashboard",
    title: "Dashboard",
    text: tUI('home.sections.dashboard'),
    highlight: true,
  },
  {
    href: "/originators",
    title: "Originators",
    text: "Counterparties in the receivables market (Tax ID, Legal Name).",
  },
  {
    href: "/receivables",
    title: "Recebíveis",
    text: tUI('home.sections.receivables'),
  },
  {
    href: "/credit-operations",
    title: "Credit Operations",
    text: "Operations linked to receivables and originators.",
  },
  {
    href: "/regulatory-gaps",
    title: "Regulatory Gaps",
    text: "Compliance gap tracking (Central Bank, etc.).",
  },
  {
    href: "/imports",
    title: "Importações",
    text: tUI('home.sections.imports'),
  },
];

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title={tUI('home.page.title')}
        description={tUI('home.page.description')}
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
