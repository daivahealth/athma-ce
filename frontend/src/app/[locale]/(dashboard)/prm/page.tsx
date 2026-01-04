import { redirect } from 'next/navigation';

export default function PrmPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/prm/events`);
}
