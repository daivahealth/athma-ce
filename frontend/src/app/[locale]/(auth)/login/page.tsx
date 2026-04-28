'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login, setSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
  mfaCode: z.string().optional(),
});

function LoginPageContent({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('actions');
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
      rememberMe: true,
      mfaCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    try {
      const data = await login(values);
      if (data.accessToken) {
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          user: decodeAccessToken(data.accessToken),
        });
        toast({
          title: 'Welcome back',
          description: 'Session secured with MFA-ready token.',
          variant: 'success',
        });
        router.push(`/${params.locale}/dashboard`);
      } else if (data.requiresMfa) {
        setError('Multi-factor authentication required. Enter your code.');
        toast({
          title: 'MFA required',
          description: 'Enter your verification code to continue.',
          variant: 'default',
        });
      } else {
        setError('Login response missing tokens.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Unable to authenticate.';
      setError(message);
      toast({ title: 'Authentication failed', description: message, variant: 'destructive' });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-background to-amber-50 p-6">
      <Card className="w-full max-w-md border-orange-100/80 shadow-xl shadow-orange-100/40">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <>
              <Image
                src="/athma-logo.svg"
                alt="Athma"
                width={220}
                height={64}
                className="h-14 w-auto dark:hidden"
                priority
              />
              <Image
                src="/athma-logo-dark.svg"
                alt="Athma"
                width={220}
                height={64}
                className="hidden h-14 w-auto dark:block"
                priority
              />
            </>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                required
                autoComplete="current-password"
              />
            </div>
            {form.watch('mfaCode') && (
              <div className="space-y-2">
                <Label htmlFor="mfaCode">MFA Code</Label>
                <Input id="mfaCode" {...form.register('mfaCode')} inputMode="numeric" />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {t('login')}
            </Button>
          </form>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Link href={`/${params.locale}/reset-password`} className="hover:text-primary">
              Forgot password?
            </Link>
            <Link href={`/${params.locale}/confirm-reset`} className="hover:text-primary">
              I have a reset token
            </Link>
          </div>
          <div className="text-center">
            <Link
              href={`/${params.locale}/debug`}
              className="text-xs text-muted-foreground hover:text-primary underline"
            >
              🔍 Debug Session Info
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage({ params }: { params: { locale: string } }) {
  return (
    <Suspense fallback={null}>
      <LoginPageContent params={params} />
    </Suspense>
  );
}
