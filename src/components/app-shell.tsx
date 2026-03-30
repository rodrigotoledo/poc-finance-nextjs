"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExportAlerts } from "@/components/alerts/export-alerts";

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">Crédito POC</p>
          <p className="truncate text-xs text-zinc-500">Console</p>
        </div>
      )}
    </div>
  );
}

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}

function IconReceipt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 17.5v1.5M12 5v1.5"/>
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconUpload() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

const nav = [
  { href: "/",                  label: "Início",               icon: <IconHome /> },
  { href: "/dashboard",         label: "Dashboard",            icon: <IconDashboard /> },
  { href: "/originators",       label: "Originadores",         icon: <IconBuilding /> },
  { href: "/receivables",       label: "Recebíveis",           icon: <IconReceipt /> },
  { href: "/credit-operations", label: "Operações de crédito", icon: <IconCreditCard /> },
  { href: "/regulatory-gaps",   label: "Gaps regulatórios",    icon: <IconShield /> },
  { href: "/imports",           label: "Importações",          icon: <IconUpload /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside
        className="relative flex min-h-screen shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width] duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950"
        style={{ width: collapsed ? "64px" : "240px" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Logo collapsed={collapsed} />
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-18 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 overflow-hidden p-2 pt-3">
          {nav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <span className={isActive ? "text-indigo-600 dark:text-indigo-400" : ""}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer (hide dev-only metadata) */}
      </aside>

      {/* Main */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <ExportAlerts />
        <header className="flex h-16 shrink-0 items-center border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {nav.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)))?.label ?? "Console"}
          </h2>
        </header>
        <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
