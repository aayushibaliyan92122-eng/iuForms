import { trpc } from "~/trpc/client";

export function useDashboardStats() {
  const {
    data: stats,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.dashboard.getStats.useQuery();

  return {
    stats,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
}

export function useRecentForms() {
  const {
    data: forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.dashboard.listRecentForms.useQuery();

  return {
    forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
}
