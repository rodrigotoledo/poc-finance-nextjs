import { fetchNestJson } from '@/lib/api/fetch-nest';
import { normalizeDashboardStats } from '@/lib/dashboard/normalize-dashboard-stats';
import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => normalizeDashboardStats(await fetchNestJson<unknown>('/dashboard')),
    refetchInterval: 1_500, // refetch every 1.5s as fallback
    refetchOnWindowFocus: true,
  });
}