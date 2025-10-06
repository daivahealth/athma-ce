import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { authClient } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

export async function POST(request: Request) {
  const payload = await request.json();
  try {
    const { data } = await authClient.post('/login', payload);
    if (!data.accessToken) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const cookieStore = cookies();
    if (data.refreshToken) {
      cookieStore.set('zeal_refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({
      accessToken: data.accessToken,
      user: decodeAccessToken(data.accessToken),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.response?.data?.message ?? 'Login failed' }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('zeal_refresh_token');
  return NextResponse.json({ success: true });
}
