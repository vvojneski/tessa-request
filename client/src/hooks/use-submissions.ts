import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertSubmission } from "@shared/routes";

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const res = await fetch(api.submissions.create.path, {
        method: api.submissions.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }
      
      return res.json();
    },
    // If we had a list query, we'd invalidate it here
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [api.submissions.list.path] });
    }
  });
}
