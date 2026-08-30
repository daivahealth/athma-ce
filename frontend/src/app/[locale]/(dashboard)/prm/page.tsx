import { redirect } from 'next/navigation';

export default async function PrmPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/prm/events`);
}
