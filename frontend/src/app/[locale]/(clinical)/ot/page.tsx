import { redirect } from 'next/navigation';

export default function OtPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/ot/board`);
}
