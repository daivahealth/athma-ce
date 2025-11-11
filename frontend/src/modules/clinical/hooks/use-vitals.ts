import { useQuery } from '@tanstack/react-query';
import { vitalsService } from '../services/vitals-service';

export function useVitals(encounterId: string) {
  return useQuery({
    queryKey: ['vitals', encounterId],
    queryFn: () => vitalsService.getVitals(encounterId),
    enabled: !!encounterId,
  });
}
