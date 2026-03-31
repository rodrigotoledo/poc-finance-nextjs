/**
 * Centralized status colors for consistent theming across the application
 * Used in charts, badges, and other UI components
 */

export const STATUS_COLORS = {
  // Credit Operations
  approved: '#10b981',  // emerald-500
  settled: '#8b5cf6',   // violet-500
  draft: '#a1a1aa',     // zinc-400
  cancelled: '#ef4444', // red-500

  // Receivables
  pending: '#f59e0b',   // amber-500
  eligible: '#14b8a6',  // teal-500
  advanced: '#a855f7',  // purple-500
  rejected: '#ef4444',  // red-500

  // Imports / Generic
  processing: '#3b82f6', // blue-500
  completed: '#10b981',  // emerald-500
  failed: '#ef4444',     // red-500
  error: '#ef4444',      // red-500
} as const;

/**
 * Mapping of status colors to Tailwind CSS classes for consistency
 * Used in badges and other UI elements
 */
export const STATUS_TAILWIND_CLASSES: Record<StatusKey, string> = {
  approved: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
  settled: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100',
  draft: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
  cancelled: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
  eligible: 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100',
  advanced: 'bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-100',
  rejected: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
  processing: 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100',
  completed: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
  failed: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
  error: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
};

export type StatusKey = keyof typeof STATUS_COLORS;

/**
 * Get status color with fallback
 */
export function getStatusColor(status: string): string {
  const key = status.toLowerCase() as StatusKey;
  return STATUS_COLORS[key] || '#6b7280'; // gray-500 as fallback
}

/**
 * Get status Tailwind CSS class with fallback
 */
export function getStatusTailwindClass(status: string): string {
  const key = status.toLowerCase() as StatusKey;
  return STATUS_TAILWIND_CLASSES[key] || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100';
}

/**
 * Fallback color palette for when we need more colors than defined statuses
 */
export const FALLBACK_COLORS = [
  '#6366f1', // indigo-500
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#14b8a6', // teal-500
];

/**
 * Get fallback color by index
 */
export function getFallbackColor(index: number): string {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}