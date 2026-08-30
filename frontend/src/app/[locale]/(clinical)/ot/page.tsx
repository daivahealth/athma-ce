import { redirect } from 'next/navigation';

export default async function OtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/ot/board`);
}
