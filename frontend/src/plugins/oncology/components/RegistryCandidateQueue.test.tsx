import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegistryCandidateQueue } from './RegistryCandidateQueue';
import { oncologyService } from '../services/oncology-service';
import type { RegistryCandidate } from '../types';

jest.mock('../services/oncology-service', () => ({
  oncologyService: { dismissRegistryCandidate: jest.fn().mockResolvedValue({ dismissed: 1 }) },
}));
jest.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: jest.fn() }) }));
jest.mock('next/navigation', () => ({ useParams: () => ({ locale: 'en' }) }));

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
      orderId: 'o1',
    },
    {
      sourceType: 'tumor_marker', sourceId: 's2', strength: 'low', title: 'CA 15-3',
      excerpt: '48 U/mL (ref ≤ 30) — above normal', matchedTerms: ['CA 15-3'], resultAt: '2026-11-01T10:00:00.000Z',
      orderId: 'o2',
    },
    {
      sourceType: 'imaging', sourceId: 's3', strength: 'medium', title: 'Mammogram',
      excerpt: 'BI-RADS 5.', matchedTerms: ['BI-RADS 4/5/6'], resultAt: '2026-10-30T10:00:00.000Z',
      orderId: 'o3',
    },
    {
      sourceType: 'diagnosis', sourceId: 's4', strength: 'high', title: 'Coded diagnosis',
      excerpt: 'C50.4 — Malignant neoplasm of breast', matchedTerms: ['C50.4'], resultAt: '2026-10-29T10:00:00.000Z',
      icdCode: 'C50.4', orderId: null,
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

  it('links each result to its report page; coded diagnoses have no link', () => {
    renderQueue();
    expect(screen.getByRole('link', { name: 'Core biopsy, breast' })).toHaveAttribute('href', '/en/results/lab/o1');
    expect(screen.getByRole('link', { name: 'CA 15-3' })).toHaveAttribute('href', '/en/results/lab/o2');
    expect(screen.getByRole('link', { name: 'Mammogram' })).toHaveAttribute('href', '/en/results/imaging/o3');
    expect(screen.queryByRole('link', { name: 'Coded diagnosis' })).not.toBeInTheDocument();
    expect(screen.getByText('Coded diagnosis', { selector: 'span.truncate' })).toBeInTheDocument();
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
          { sourceType: 'imaging', sourceId: 's3' },
          { sourceType: 'diagnosis', sourceId: 's4' },
        ],
      }),
    );
  });

  it('explains the queue when it is empty', () => {
    renderQueue(jest.fn(), []);
    expect(screen.getByText('No patients waiting for review')).toBeInTheDocument();
  });
});
