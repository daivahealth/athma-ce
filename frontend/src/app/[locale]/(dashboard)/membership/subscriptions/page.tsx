'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Loader2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { SubscriptionDialog } from './_components/subscription-dialog';
import { useMembershipSubscriptions } from '@/modules/wellness/hooks/use-membership';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function SubscriptionsPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.subscriptions')}</h1>
            <p className="text-muted-foreground">
              Manage patient subscriptions and recurring billing
            </p>
          </div>
        </div>
        <SubscriptionDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Subscription
          </Button>
        </SubscriptionDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionList />
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionList() {
  const { data: subscriptions, isLoading } = useMembershipSubscriptions();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
        <h3 className="text-lg font-medium">No subscriptions found</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Enroll patients into membership plans to track their subscriptions here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2 rounded-full",
              sub.status === 'active' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
            )}>
              {sub.status === 'active' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-semibold text-lg flex items-center gap-2">
                {sub.patient?.firstName} {sub.patient?.lastName}
                <span className="text-xs font-normal px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {sub.plan?.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Started {format(new Date(sub.startDate), 'MMM d, yyyy')}
                </span>
                <span>•</span>
                <span className="capitalize">{sub.billingCycle} billing</span>
                {sub.nextBillingDate && (
                  <>
                    <span>•</span>
                    <span>Next billing: {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">
              {sub.billingCycle === 'monthly' ? sub.plan?.monthlyPrice : sub.plan?.yearlyPrice} {sub.plan?.currency}
            </div>
            <div className={cn(
              "text-xs font-medium uppercase tracking-wider",
              sub.status === 'active' ? "text-green-600" : "text-muted-foreground"
            )}>
              {sub.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
