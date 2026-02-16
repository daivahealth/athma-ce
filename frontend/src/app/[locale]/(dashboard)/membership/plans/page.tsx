'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Plus } from 'lucide-react';
import { MembershipPlanDialog } from './_components/membership-plan-dialog';

export default function MembershipPlansPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.membershipPlans')}</h1>
            <p className="text-muted-foreground">
              Create and manage membership tiers and benefits
            </p>
          </div>
        </div>
        <MembershipPlanDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </MembershipPlanDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Membership plan catalog with tier management (Basic, Standard, Premium, Platinum, VIP)
            and benefit configuration will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
