import { Global, Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { OutboxService } from './outbox.service';
import { OutboxDispatcherService } from './outbox-dispatcher.service';

/**
 * Transactional outbox (ADR-0015 §5): OutboxService for producers (write in
 * the same $transaction as the domain change) and the polling dispatcher
 * delivering to connector subscribers. Global so any domain module can emit
 * without extra wiring.
 */
@Global()
@Module({
  imports: [ClinicalDatabaseModule],
  providers: [OutboxService, OutboxDispatcherService],
  exports: [OutboxService],
})
export class EventsModule {}
