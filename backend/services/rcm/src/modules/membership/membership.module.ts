import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { MembershipPlanService } from './services/membership-plan.service';
import { SubscriptionService } from './services/subscription.service';
import { RecurringBillingService } from './services/recurring-billing.service';

// Controllers
import { MembershipPlanController } from './controllers/membership-plan.controller';
import { SubscriptionController } from './controllers/subscription.controller';

// Jobs
import { RecurringBillingJob } from './jobs/recurring-billing.job';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    MembershipPlanController,
    SubscriptionController,
  ],
  providers: [
    PrismaService,
    // Services
    MembershipPlanService,
    SubscriptionService,
    RecurringBillingService,
    // Jobs
    RecurringBillingJob,
  ],
  exports: [
    MembershipPlanService,
    SubscriptionService,
    RecurringBillingService,
  ],
})
export class MembershipModule {}
