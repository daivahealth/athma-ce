import { useQuery } from '@tanstack/react-query';
import { bedService } from '../services/bed-service';

export function useBed(id: string | undefined | null) {
  return useQuery({
    queryKey: ['beds', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Bed ID is required');
      }
      return bedService.getById(id);
    },
    enabled: !!id,
  });
}
