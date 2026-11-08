import { isReadOnlyError, isReadOnlyToken, notifyReadOnlyRefusal } from '@/lib/auth/read-only';
import { useToastStore } from '@/components/ui/use-toast';

function fakeToken(payload: Record<string, unknown>): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
}

describe('read-only helpers', () => {
  it('reads the readOnly claim from an access token', () => {
    expect(isReadOnlyToken(fakeToken({ sub: 'u1', readOnly: true }))).toBe(true);
    expect(isReadOnlyToken(fakeToken({ sub: 'u1' }))).toBe(false);
    expect(isReadOnlyToken(null)).toBe(false);
  });

  it('recognises only the READ_ONLY_ACCESS refusal', () => {
    expect(isReadOnlyError({ response: { status: 403, data: { code: 'READ_ONLY_ACCESS' } } })).toBe(true);
    expect(isReadOnlyError({ response: { status: 403, data: { message: 'Missing permissions' } } })).toBe(false);
    expect(isReadOnlyError({ response: { status: 401, data: { code: 'READ_ONLY_ACCESS' } } })).toBe(false);
    expect(isReadOnlyError(new Error('network'))).toBe(false);
  });

  it('shows one toast for a burst of refusals', () => {
    // jsdom lacks crypto.randomUUID, which the toast store uses for ids
    if (typeof globalThis.crypto?.randomUUID !== 'function') {
      Object.defineProperty(globalThis, 'crypto', {
        value: { ...globalThis.crypto, randomUUID: () => 'toast-id' },
        configurable: true,
      });
    }
    useToastStore.setState({ toasts: [] });
    notifyReadOnlyRefusal();
    notifyReadOnlyRefusal();
    notifyReadOnlyRefusal();
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.title).toBe('Read-only demo');
  });
});
