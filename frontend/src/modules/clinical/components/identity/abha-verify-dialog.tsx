'use client';

/**
 * ABHA (India / ABDM) guided flow — two entry points:
 *
 *   Verify existing : ABHA number / mobile / Aadhaar  → OTP → linked
 *   Create new      : Aadhaar → OTP → ABHA issued → claim an ABHA address
 *
 * PRIVACY: the Aadhaar number and the OTP live in component state only for the
 * duration of the request that consumes them, and are cleared as soon as the
 * step advances. They are never written to storage, query cache, or logs.
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import {
  useStartIdentityChallenge,
  useCompleteIdentityChallenge,
  useAbhaAddressSuggestions,
  useCreateAbhaAddress,
} from '../../hooks/use-national-identity';
import type {
  IdentityProviderInfo,
  IdentityVerificationResult,
} from '../../types/national-identity';
import { getApiErrorMessage } from '@/lib/api/errors';

interface AbhaVerifyDialogProps {
  patientId: string;
  provider: IdentityProviderInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'choose' | 'otp' | 'address' | 'done';

const HINT_LABELS: Record<string, string> = {
  aadhaar: 'Aadhaar number',
  mobile: 'Mobile number',
  'abha-number': 'ABHA number',
};

export function AbhaVerifyDialog({
  patientId,
  provider,
  open,
  onOpenChange,
}: AbhaVerifyDialogProps) {
  const { toast } = useToast();
  const startChallenge = useStartIdentityChallenge();
  const completeChallenge = useCompleteIdentityChallenge();
  const fetchSuggestions = useAbhaAddressSuggestions();
  const createAddress = useCreateAbhaAddress();

  const [step, setStep] = useState<Step>('choose');
  const [purpose, setPurpose] = useState<'verify' | 'enroll'>('verify');
  const [loginHint, setLoginHint] = useState('abha-number');
  const [loginId, setLoginId] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [txnId, setTxnId] = useState('');
  const [maskedTarget, setMaskedTarget] = useState('');
  const [result, setResult] = useState<IdentityVerificationResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [abhaAddress, setAbhaAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) reset();
  }, [open]);

  function reset() {
    setStep('choose');
    setPurpose('verify');
    setLoginHint('abha-number');
    setLoginId('');
    setMobile('');
    setOtp('');
    setTxnId('');
    setMaskedTarget('');
    setResult(null);
    setSuggestions([]);
    setAbhaAddress('');
    setError('');
  }

  const choosePurpose = (next: 'verify' | 'enroll') => {
    setPurpose(next);
    // Enrolment is Aadhaar-only per ABDM.
    setLoginHint(next === 'enroll' ? 'aadhaar' : 'abha-number');
    setLoginId('');
    setError('');
  };

  const handleSendOtp = async () => {
    setError('');
    try {
      const challenge = await startChallenge.mutateAsync({
        country: provider.country,
        identityType: provider.identityType,
        purpose,
        loginHint,
        loginId: loginId.trim(),
        patientId,
      });
      setTxnId(challenge.txnId);
      setMaskedTarget(challenge.maskedTarget ?? '');
      // The identifier has served its purpose — drop it immediately.
      setLoginId('');
      setStep('otp');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send the OTP. Please try again.'));
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    try {
      const verification = await completeChallenge.mutateAsync({
        txnId,
        payload: {
          otp: otp.trim(),
          ...(purpose === 'enroll' && mobile.trim() ? { mobile: mobile.trim() } : {}),
          patientId,
        },
      });
      setOtp('');
      setResult(verification);

      // A brand-new account still needs an ABHA address before it is usable.
      if (purpose === 'enroll' && !verification.secondaryValue) {
        try {
          const options = await fetchSuggestions.mutateAsync(txnId);
          setSuggestions(options);
          setAbhaAddress(options[0] ?? '');
          setStep('address');
          return;
        } catch {
          // Suggestions are a convenience — a failure here must not lose the
          // ABHA number that was just issued and linked.
          setStep('done');
          return;
        }
      }

      setStep('done');
      toast({ title: 'ABHA verified', description: verification.identityValue });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Verification failed. Please try again.'));
    }
  };

  const handleClaimAddress = async () => {
    setError('');
    try {
      await createAddress.mutateAsync({ txnId, abhaAddress: abhaAddress.trim(), patientId });
      toast({ title: 'ABHA created', description: abhaAddress.trim() });
      setStep('done');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not claim this address.'));
    }
  };

  const isBusy =
    startChallenge.isPending ||
    completeChallenge.isPending ||
    fetchSuggestions.isPending ||
    createAddress.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            ABHA
            {provider.gateway === 'mock' && (
              <Badge variant="outline" className="ml-1">
                mock gateway
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Ayushman Bharat Health Account — {provider.environment ?? 'sandbox'} environment.
          </DialogDescription>
        </DialogHeader>

        {step === 'choose' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={purpose === 'verify' ? 'default' : 'outline'}
                onClick={() => choosePurpose('verify')}
              >
                Verify existing
              </Button>
              <Button
                variant={purpose === 'enroll' ? 'default' : 'outline'}
                onClick={() => choosePurpose('enroll')}
              >
                Create new
              </Button>
            </div>

            {purpose === 'verify' && (
              <div className="space-y-2">
                <Label htmlFor="abha-hint">Verify using</Label>
                <Select value={loginHint} onValueChange={setLoginHint}>
                  <SelectTrigger id="abha-hint">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provider.loginHints.map((hint) => (
                      <SelectItem key={hint} value={hint}>
                        {HINT_LABELS[hint] ?? hint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="abha-login-id">{HINT_LABELS[loginHint] ?? 'Identifier'}</Label>
              <Input
                id="abha-login-id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="off"
                inputMode="numeric"
                placeholder={loginHint === 'aadhaar' ? '12-digit Aadhaar' : ''}
              />
              {loginHint === 'aadhaar' && (
                <p className="text-xs text-muted-foreground">
                  The Aadhaar number is encrypted before it leaves this system and is never stored.
                </p>
              )}
            </div>

            {purpose === 'enroll' && (
              <div className="space-y-2">
                <Label htmlFor="abha-mobile">Mobile number (optional)</Label>
                <Input
                  id="abha-mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
            )}
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              An OTP has been sent{maskedTarget ? ` to ${maskedTarget}` : ''}.
            </p>
            <div className="space-y-2">
              <Label htmlFor="abha-otp">OTP</Label>
              <Input
                id="abha-otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ABHA number <span className="font-mono">{result?.identityValue}</span> was created.
              Choose an ABHA address.
            </p>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="abha-suggestion">Suggestions</Label>
                <Select value={abhaAddress} onValueChange={setAbhaAddress}>
                  <SelectTrigger id="abha-suggestion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {suggestions.map((suggestion) => (
                      <SelectItem key={suggestion} value={suggestion}>
                        {suggestion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="abha-address">ABHA address</Label>
              <Input
                id="abha-address"
                value={abhaAddress}
                onChange={(e) => setAbhaAddress(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-3">
            <div className="rounded-md border border-emerald-500/40 bg-emerald-50 p-4 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                {purpose === 'enroll' ? 'ABHA created and linked' : 'ABHA verified and linked'}
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Number:</dt>
                  <dd className="font-mono">{result?.identityValue}</dd>
                </div>
                {(abhaAddress || result?.secondaryValue) && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Address:</dt>
                    <dd>{abhaAddress || result?.secondaryValue}</dd>
                  </div>
                )}
                {result?.demographics?.fullName && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd>{result.demographics.fullName}</dd>
                  </div>
                )}
                {result?.demographics?.maskedMobile && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Mobile:</dt>
                    <dd>{result.demographics.maskedMobile}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          {step === 'choose' && (
            <Button onClick={handleSendOtp} disabled={isBusy || !loginId.trim()}>
              {isBusy ? 'Sending…' : 'Send OTP'}
            </Button>
          )}
          {step === 'otp' && (
            <>
              <Button variant="outline" onClick={() => setStep('choose')} disabled={isBusy}>
                Back
              </Button>
              <Button onClick={handleVerifyOtp} disabled={isBusy || otp.trim().length < 4}>
                {isBusy ? 'Verifying…' : 'Verify'}
              </Button>
            </>
          )}
          {step === 'address' && (
            <>
              <Button variant="outline" onClick={() => setStep('done')} disabled={isBusy}>
                Skip
              </Button>
              <Button onClick={handleClaimAddress} disabled={isBusy || !abhaAddress.trim()}>
                {isBusy ? 'Saving…' : 'Claim address'}
              </Button>
            </>
          )}
          {step === 'done' && <Button onClick={() => onOpenChange(false)}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
