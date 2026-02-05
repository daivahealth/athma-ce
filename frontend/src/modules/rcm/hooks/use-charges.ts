import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chargeService } from '../services/charge-service';
import type { CreateChargeInput } from '../types/charge';

export function useEncounterCharges(encounterId?: string) {
  return useQuery({
    queryKey: ['charges', 'encounter', encounterId],
    queryFn: () => chargeService.getByEncounter(encounterId!),
    enabled: Boolean(encounterId),
  });
}

export function useCreateChargesBulk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (charges: CreateChargeInput[]) =>
      chargeService.createBulk(charges),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges'] });
    },
  });
}
