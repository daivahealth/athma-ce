import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegistryCandidateQueue } from './RegistryCandidateQueue';
import { oncologyService } from '../services/oncology-service';
import type { RegistryCandidate } from '../types';

jest.mock('../services/oncology-service', () => ({
  oncologyService: { dismissRegistryCandidate: jest.fn().mockResolvedValue({ dismissed: 1 }) },
}));
jest.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: jest.fn() }) }));

const candidate: RegistryCandidate = {
  patientId: 'p1',
  strength: 'high',
  latestResultAt: '2026-11-06T10:00:00.000Z',
  patientDisplay: {
    patientId: 'p1', mrn: 'MRN-1', firstName: 'Hamdan', lastName: 'Das', displayName: 'Hamdan Das',
    age: 52, dateOfBirth: '1974-01-01', gender: 'male',
  },
  evidence: [
    {
      sourceType: 'pathology', sourceId: 's1', strength: 'high', title: 'Core biopsy, breast',
      excerpt: 'Invasive ductal carcinoma, grade 2.', matchedTerms: ['carcinoma'], resultAt: '2026-11-06T10:00:00.000Z',
    },
    {
      sourceType: 'tumor_marker', sourceId: 's2', strength: 'low', title: 'CA 15-3',
      excerpt: '48 U/mL (ref ≤ 30) — above normal', matchedTerms: ['CA 15-3'], resultAt: '2026-11-01T10:00:00.000Z',
    },
  ],
};

function renderQueue(onAdd = jest.fn(), candidates = [candidate]) {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <RegistryCandidateQueue candidates={candidates} isLoading={false} onAdd={onAdd} />
    </QueryClientProvider>,
  );
  return onAdd;
}

describe('RegistryCandidateQueue', () => {
  it('shows each candidate with the results that flagged them', () => {
    renderQueue();
    expect(screen.getByText('Hamdan Das')).toBeInTheDocument();
    expect(screen.getByText('Pathology')).toBeInTheDocument();
    expect(screen.getByText(/Invasive ductal carcinoma/)).toBeInTheDocument();
    expect(screen.getByText('Tumour marker')).toBeInTheDocument();
  });

  it('adds the patient from the queue', () => {
    const onAdd = renderQueue();
    fireEvent.click(screen.getByRole('button', { name: /Add to Registry/ }));
    expect(onAdd).toHaveBeenCalledWith(candidate);
  });

  it('dismisses with a reason and sends every result shown', async () => {
    renderQueue();
    fireEvent.click(screen.getByRole('button', { name: /Dismiss/ }));
    const confirm = screen.getAllByRole('button', { name: 'Dismiss' }).at(-1)!;
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Not a cancer case on review' }));
    fireEvent.click(confirm);
    await waitFor(() =>
      expect(oncologyService.dismissRegistryCandidate).toHaveBeenCalledWith('p1', {
        reason: 'Not a cancer case on review',
        sources: [
          { sourceType: 'pathology', sourceId: 's1' },
          { sourceType: 'tumor_marker', sourceId: 's2' },
        ],
      }),
    );
  });

  it('explains the queue when it is empty', () => {
    renderQueue(jest.fn(), []);
    expect(screen.getByText('No patients waiting for review')).toBeInTheDocument();
  });
});
