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

const schema = z.object({
  token: z.string().min(8),
  newPassword: z.string().min(8),
});

export default function ConfirmResetPage({ params }: { params: { locale: string } }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { token: '', newPassword: '' } });

  async function onSubmit(values: z.infer<typeof schema>) {
    setStatus('idle');
    try {
      await authClient.post('/confirm-reset-password', values);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Complete password reset</CardTitle>
          <CardDescription>Paste the token emailed to you and set a new password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="token">Reset token</Label>
              <Input id="token" {...form.register('token')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...form.register('newPassword')} required />
            </div>
            <Button type="submit" className="w-full">Update password</Button>
          </form>
          {status === 'success' && (
            <p className="text-sm text-success-foreground">
              Password updated. You can now sign in with your new credentials.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-destructive">
              Invalid or expired token. Please request a new reset.
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
