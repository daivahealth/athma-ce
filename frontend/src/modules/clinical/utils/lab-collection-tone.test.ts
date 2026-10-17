import {
  LAB_COLLECTION_STATE_LABEL,
  LAB_COLLECTION_STATE_TONE,
  fastingTone,
  labCollectionStateTone,
} from './lab-collection-tone';

describe('lab collection tones', () => {
  it.each(['ready', 'prepared'] as const)('maps %s and labels it', (state) => {
    expect(labCollectionStateTone(state)).toBe(LAB_COLLECTION_STATE_TONE[state]);
    expect(LAB_COLLECTION_STATE_LABEL[state]).toBeTruthy();
  });

  it('falls back to slate for an unknown state', () => {
    expect(labCollectionStateTone('collected')).toBe('slate');
  });

  it('marks a fasting requirement and leaves no-fasting neutral', () => {
    expect(fastingTone(true)).toBe('orange');
    expect(fastingTone(false)).toBe('slate');
  });
});
