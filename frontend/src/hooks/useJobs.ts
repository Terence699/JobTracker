import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@/services/api';

export interface Job {
  _id: string;
  companyName: string;
  position: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  appliedDate: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
}

export const useJobs = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const token = await getToken();
      const res = await api.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data as Job[];
    },
    enabled: isLoaded && isSignedIn,
  });
};

export const useUpdateJobStatus = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const token = await getToken();
            return api.patch(`/api/jobs/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] });
            const previousJobs = queryClient.getQueryData(['jobs']);
            
            queryClient.setQueryData(['jobs'], (old: Job[] | undefined) => {
                if (!old) return [];
                return old.map(job => job._id === id ? { ...job, status: status as Job["status"] } : job);
            });
            
            return { previousJobs };
        },
        onError: (_err, _variables, context) => {
            void _err;
            void _variables;
            queryClient.setQueryData(['jobs'], context?.previousJobs);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    });
}
