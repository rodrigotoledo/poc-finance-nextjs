export function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();

  // CreditOperation statuses
  if (s === "approved")
    return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
  if (s === "settled")
    return "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100";
  if (s === "draft")
    return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
  if (s === "cancelled")
    return "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100";

  // Receivable statuses (fallback palette)
  if (s === "eligible")
    return "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100";
  if (s === "advanced")
    return "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-100";
  if (s === "pending")
    return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";

  // Imports / generic
  if (s === "processing")
    return "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100";
  if (s === "completed" || s === "done")
    return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
  if (s === "failed" || s === "error")
    return "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100";

  return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
}

