/**
 * Form Master Module
 *
 * OpenMedForm integration: master form definitions uploaded by an admin,
 * filled by clinicians against a patient + encounter.
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { FormMasterService } from './services/form-master.service';
import { FormResponseService } from './services/form-response.service';
import { FormMasterController } from './controllers/form-master.controller';
import { FormResponseController } from './controllers/form-response.controller';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [FormMasterController, FormResponseController],
  providers: [FormMasterService, FormResponseService],
  exports: [FormMasterService, FormResponseService],
})
export class FormMasterModule {}
