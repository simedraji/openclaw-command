import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOpenClawTask, fetchDashboard, type DashboardSnapshot } from "@/lib/openclaw-api";

export function useOpenClawDashboard() {
  return useQuery({
    queryKey: ["openclaw-dashboard"],
    queryFn: ({ signal }) => fetchDashboard(signal),
    refetchInterval: 5_000,
    retry: false,
  });
}

export function useOpenClawTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOpenClawTask,
    onSuccess: (task) => {
      queryClient.setQueryData<DashboardSnapshot>(["openclaw-dashboard"], (current) =>
        current ? { ...current, tasks: [task, ...current.tasks] } : current,
      );
      void queryClient.invalidateQueries({ queryKey: ["openclaw-dashboard"] });
    },
  });
}
