import { of, throwError } from 'rxjs';
import { buildPatientDisplay, fetchEncounterPatientMap, fetchPatientDisplayMap } from './patient-display';

const patient = {
  id: 'p1',
  mrn: 'MRN-001',
  firstName: 'Asha',
  lastName: 'Rao',
  dateOfBirth: '1980-01-15T00:00:00.000Z',
  gender: 'female',
};

describe('patient-display', () => {
  it('builds a display with name, MRN, gender and age', () => {
    const display = buildPatientDisplay(patient);
    expect(display.displayName).toBe('Asha Rao');
    expect(display.mrn).toBe('MRN-001');
    expect(display.gender).toBe('female');
    expect(display.dateOfBirth).toBe('1980-01-15');
    expect(display.age).toBeGreaterThanOrEqual(45);
  });

  it('keeps age and date of birth null when the birth date is missing', () => {
    const display = buildPatientDisplay({ ...patient, dateOfBirth: null });
    expect(display.age).toBeNull();
    expect(display.dateOfBirth).toBeNull();
  });

  it('fetches each unique patient once and skips failed lookups', async () => {
    const get = jest.fn((url: string) =>
      url.endsWith('/patients/p1') ? of({ data: patient }) : throwError(() => new Error('404')),
    );
    const map = await fetchPatientDisplayMap({ get } as any, ['p1', 'p1', 'p2', null], { tenantId: 't1' });
    expect(get).toHaveBeenCalledTimes(2);
    expect(map.get('p1')?.displayName).toBe('Asha Rao');
    expect(map.has('p2')).toBe(false);
  });

  it('resolves a patient through the encounter and forwards tenant headers', async () => {
    const get = jest.fn(() =>
      of({ data: { id: 'e1', patientId: 'p1', patientDisplay: { displayName: 'Asha Rao', mrn: 'MRN-001' } } }),
    );
    const map = await fetchEncounterPatientMap({ get } as any, ['e1'], { tenantId: 't1', authHeader: 'Bearer x' });
    expect(map.get('e1')).toMatchObject({ patientId: 'p1', patientDisplay: { displayName: 'Asha Rao' } });
    const headers = (get.mock.calls[0] as any[])[1].headers;
    expect(headers).toMatchObject({ 'x-tenant-id': 't1', authorization: 'Bearer x' });
  });
});
