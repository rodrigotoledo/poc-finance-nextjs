'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { DataError } from '@/components/data-error';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { tUI } from '@/lib/i18n/ui';

export function DashboardContent() {
  const { data: stats, error, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div>{tUI('dashboard.loadingStats')}</div>;
  }

  if (error || !stats) {
    return <DataError message={error?.message ?? tUI('dashboard.errorLoad')} />;
  }

  return <StatsCards stats={stats} />;
}