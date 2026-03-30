'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { DataError } from '@/components/data-error';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

export function DashboardContent() {
  const { data: stats, error, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div>Carregando estatísticas...</div>;
  }

  if (error || !stats) {
    return <DataError message={error?.message ?? "Erro ao carregar dashboard"} />;
  }

  return <StatsCards initialData={stats} />;
}