import { redirect } from 'next/navigation';

export default function DashboardRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard`);
}
