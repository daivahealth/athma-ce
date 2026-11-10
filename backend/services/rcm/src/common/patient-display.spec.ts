import { of, throwError } from 'rxjs';
import {
  PATIENT_SEARCH_MATCH_CAP,
  buildPatientDisplay,
  fetchEncounterPatientMap,
  fetchPatientDisplayMap,
  searchEncounterIds,
  searchPatientIds,
} from './patient-display';

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

  it('resolves patient ids for a search term from Clinical, capped and tenant-scoped', async () => {
    const get = jest.fn(() => of({ data: { data: [{ id: 'p1' }, { id: 'p2' }], pagination: { total: 2 } } }));
    const ids = await searchPatientIds({ get } as any, '  asha ', { tenantId: 't1' });
    expect(ids).toEqual(['p1', 'p2']);
    const [url, config] = get.mock.calls[0] as any[];
    expect(url).toMatch(/\/patients$/);
    expect(config.params).toEqual({ search: 'asha', page: 1, limit: PATIENT_SEARCH_MATCH_CAP });
    expect(config.headers).toMatchObject({ 'x-tenant-id': 't1' });
  });

  it('returns no ids for a blank term or a failed search', async () => {
    const get = jest.fn(() => throwError(() => new Error('503')));
    expect(await searchPatientIds({ get } as any, '  ', { tenantId: 't1' })).toEqual([]);
    expect(get).not.toHaveBeenCalled();
    expect(await searchPatientIds({ get } as any, 'asha', { tenantId: 't1' })).toEqual([]);
    expect(await searchEncounterIds({ get } as any, 'asha', { tenantId: 't1' })).toEqual([]);
  });

  it('resolves encounter ids for a patient-name search', async () => {
    const get = jest.fn(() => of({ data: { data: [{ id: 'e1' }], meta: { total: 1 } } }));
    expect(await searchEncounterIds({ get } as any, 'rao', { tenantId: 't1' })).toEqual(['e1']);
    expect((get.mock.calls[0] as any[])[0]).toMatch(/\/encounters$/);
  });
});
