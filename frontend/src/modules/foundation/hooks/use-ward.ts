import { useQuery } from '@tanstack/react-query';
import { wardService } from '../services/ward-service';

export function useWard(id: string | undefined | null) {
  return useQuery({
    queryKey: ['wards', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Ward ID is required');
      }
      return wardService.getById(id);
    },
    enabled: !!id,
  });
}
