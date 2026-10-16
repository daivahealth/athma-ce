// Phase accents for the builder, matrix and schedule (cycled by phase index).
const PHASE_ACCENTS = [
  { border: 'border-l-sky-500', bg: 'bg-sky-500/10', dot: 'bg-sky-500' },
  { border: 'border-l-violet-500', bg: 'bg-violet-500/10', dot: 'bg-violet-500' },
  { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  { border: 'border-l-orange-500', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  { border: 'border-l-pink-500', bg: 'bg-pink-500/10', dot: 'bg-pink-500' },
];

export const phaseAccent = (index: number) => PHASE_ACCENTS[index % PHASE_ACCENTS.length];
