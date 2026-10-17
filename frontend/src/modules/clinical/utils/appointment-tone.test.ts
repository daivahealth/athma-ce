import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_TONE,
  appointmentStatusTone,
} from './appointment-tone';

describe('appointment tones', () => {
  it.each(APPOINTMENT_STATUSES)('maps %s to a deliberate tone', (status) => {
    expect(appointmentStatusTone(status)).toBe(APPOINTMENT_STATUS_TONE[status]);
  });

  it('gives each status its own tone', () => {
    const tones = Object.values(APPOINTMENT_STATUS_TONE);
    expect(new Set(tones).size).toBe(tones.length);
  });

  it('falls back to slate for an unknown status', () => {
    expect(appointmentStatusTone('teleported')).toBe('slate');
    expect(appointmentStatusTone(undefined)).toBe('slate');
  });
});
