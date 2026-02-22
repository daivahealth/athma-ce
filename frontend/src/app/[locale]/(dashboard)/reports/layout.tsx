import { ReactNode } from 'react';

interface ReportsLayoutProps {
  children: ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  return <>{children}</>;
}
