'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatNumberList, parseNumberList } from '@/plugins/oncology/lib/protocol-phases';

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

/** Text input for "1, 8, 15" / "1–4" lists; commits on blur so typing a trailing comma works. */
export function NumberListInput({ value, onChange, placeholder, className, ...rest }: Props) {
  const formatted = formatNumberList(value);
  const [text, setText] = useState(formatted);
  useEffect(() => { setText(formatted); }, [formatted]);
  const commit = () => {
    const parsed = parseNumberList(text);
    onChange(parsed);
    setText(formatNumberList(parsed));
  };
  return (
    <Input
      className={className}
      value={text}
      placeholder={placeholder}
      aria-label={rest['aria-label']}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
    />
  );
}
