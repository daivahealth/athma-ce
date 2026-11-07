import {
  interpretationArrow,
  interpretationLabel,
  interpretationTone,
  labPriorityTone,
  labStageTone,
  reportStatusTone,
} from './lab-result-tone';

describe('lab result tones', () => {
  it('colours report statuses and falls back to slate', () => {
    expect(reportStatusTone('FINAL')).toBe('emerald');
    expect(reportStatusTone('PRELIMINARY')).toBe('amber');
    expect(reportStatusTone('SOMETHING_NEW')).toBe('slate');
    expect(reportStatusTone(undefined)).toBe('slate');
  });

  it('keeps critical results red and out-of-range amber', () => {
    expect(interpretationTone('critical_low')).toBe('red');
    expect(interpretationTone('high')).toBe('amber');
    expect(interpretationTone('normal')).toBe('emerald');
  });

  it('labels and points interpretations', () => {
    expect(interpretationLabel('critical_high')).toBe('Critical high');
    expect(interpretationLabel(null)).toBe('');
    expect(interpretationArrow('critical_high')).toBe('↑');
    expect(interpretationArrow('low')).toBe('↓');
    expect(interpretationArrow('normal')).toBe('');
  });

  it('maps lab stages case-insensitively', () => {
    expect(labStageTone('ACCESSIONED')).toBe('indigo');
    expect(labStageTone('rejected')).toBe('red');
  });

  it('treats an unknown priority as worth a look', () => {
    expect(labPriorityTone('routine')).toBe('slate');
    expect(labPriorityTone('STAT')).toBe('red');
    expect(labPriorityTone('elective')).toBe('amber');
  });
});
