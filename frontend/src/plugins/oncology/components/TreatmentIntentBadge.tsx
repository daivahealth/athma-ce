'use client';

const intentColors: Record<string, string> = {
  curative: 'bg-green-100 text-green-700',
  adjuvant: 'bg-blue-100 text-blue-700',
  neoadjuvant: 'bg-indigo-100 text-indigo-700',
  palliative: 'bg-purple-100 text-purple-700',
  surveillance: 'bg-amber-100 text-amber-700',
  supportive: 'bg-teal-100 text-teal-700',
};

export function TreatmentIntentBadge({ intent }: { intent: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${intentColors[intent] || 'bg-gray-100 text-gray-600'}`}>
      {intent.replace(/_/g, ' ')}
    </span>
  );
}
