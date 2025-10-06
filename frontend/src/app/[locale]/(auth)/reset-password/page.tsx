'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/api/client';

const schema = z.object({ email: z.string().email() });

export default function ResetPasswordPage({ params }: { params: { locale: string } }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  async function onSubmit(values: z.infer<typeof schema>) {
    setStatus('idle');
    try {
      await authClient.post('/reset-password', values);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Password reset</CardTitle>
          <CardDescription>We will email a secure reset token if the account exists.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" {...form.register('email')} required />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
          {status === 'success' && (
            <p className="text-sm text-success-foreground">
              If the email is registered, a reset link has been sent.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-destructive">
              Unable to request reset right now. Please try again later.
            </p>
          )}
          <Button variant="ghost" className="w-full" asChild>
            <a href={`/${params.locale}/login`}>Return to sign in</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
