import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringBillingService } from '../services/recurring-billing.service';

/**
 * Scheduled job for processing recurring membership billing.
 *
 * This job runs daily and handles:
 * - Processing due subscription renewals
 * - Handling expired subscriptions
 * - Processing past-due subscriptions beyond grace period
 *
 * Note: This requires @nestjs/schedule to be configured in the app module.
 */
@Injectable()
export class RecurringBillingJob {
  private readonly logger = new Logger(RecurringBillingJob.name);
  private isRunning = false;

  constructor(private readonly billingService: RecurringBillingService) {}

  /**
   * Process recurring billing - runs daily at 2:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async processRecurringBilling() {
    if (this.isRunning) {
      this.logger.warn('Recurring billing job is already running, skipping...');
      return;
    }

    this.isRunning = true;
    this.logger.log('Starting recurring billing job...');

    try {
      // Process all tenants (pass no tenantId to process all)
      const result = await this.billingService.processRecurringBilling();

      this.logger.log(
        `Recurring billing completed: ${result.processed} processed, ` +
          `${result.renewed} renewed, ${result.failed} failed`,
      );

      if (result.errors.length > 0) {
        this.logger.warn(`Billing errors: ${JSON.stringify(result.errors)}`);
      }
    } catch (error) {
      this.logger.error('Recurring billing job failed', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Process expired subscriptions - runs daily at 3:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async processExpiredSubscriptions() {
    this.logger.log('Processing expired subscriptions...');

    try {
      const count = await this.billingService.processExpiredSubscriptions();
      this.logger.log(`Marked ${count} subscriptions as expired`);
    } catch (error) {
      this.logger.error('Failed to process expired subscriptions', error);
    }
  }

  /**
   * Process past-due subscriptions - runs daily at 4:00 AM
   * Cancels subscriptions that have been past-due beyond the grace period
   */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async processPastDueSubscriptions() {
    this.logger.log('Processing past-due subscriptions...');

    try {
      const count = await this.billingService.processPastDueSubscriptions();
      this.logger.log(`Cancelled ${count} past-due subscriptions (grace period expired)`);
    } catch (error) {
      this.logger.error('Failed to process past-due subscriptions', error);
    }
  }

  /**
   * Manual trigger for billing (useful for testing or on-demand processing)
   */
  async triggerBillingForTenant(tenantId: string) {
    this.logger.log(`Manually triggering billing for tenant ${tenantId}`);

    const result = await this.billingService.processRecurringBilling(tenantId);
    await this.billingService.processExpiredSubscriptions(tenantId);
    await this.billingService.processPastDueSubscriptions(tenantId);

    return result;
  }
}
