/**
 * Consent Module
 *
 * Manages GDPR-compliant patient consent
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';

// Controllers
import { ConsentController } from './consent.controller';
import { ConsentTemplateController } from './consent-template.controller';

// Services
import { ConsentService } from './consent.service';
import { ConsentTemplateService } from './consent-template.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [
    ConsentController,
    ConsentTemplateController,
  ],
  providers: [
    ConsentService,
    ConsentTemplateService,
  ],
  exports: [
    ConsentService,
    ConsentTemplateService,
  ],
})
export class ConsentModule {}
