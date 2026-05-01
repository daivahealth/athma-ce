import { Module } from '@nestjs/common';
import { AthmaPluginModule, PluginContext } from '@athma/plugin-sdk';
import { OncologyController } from './oncology.controller';
import { OncologyService } from './oncology.service';

@Module({
  controllers: [OncologyController],
  providers: [OncologyService],
  exports: [OncologyService],
})
export class OncologyModule implements AthmaPluginModule {
  async onPluginInit(context: PluginContext): Promise<void> {
    context.extensionRegistry.registerEncounterType({
      code: 'oncology_consult',
      display: 'Oncology Consultation',
      encounterClass: 'AMB',
      pluginId: context.pluginId,
      description: 'Outpatient oncology consultation',
    });

    context.extensionRegistry.registerEncounterType({
      code: 'oncology_care_plan_review',
      display: 'Oncology Care Plan Review',
      encounterClass: 'AMB',
      pluginId: context.pluginId,
      description: 'Review and update of oncology care plan',
    });

    context.extensionRegistry.registerEncounterType({
      code: 'chemotherapy_session',
      display: 'Chemotherapy Session',
      encounterClass: 'AMB',
      pluginId: context.pluginId,
      description: 'Chemotherapy administration session',
    });

    context.extensionRegistry.registerObservationCodes([
      {
        code: 'onc-tumor-size',
        display: 'Tumor Size',
        system: 'athma-oncology',
        unit: 'cm',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'numeric',
      },
      {
        code: 'onc-psa',
        display: 'PSA Level',
        system: 'athma-oncology',
        unit: 'ng/mL',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'numeric',
      },
      {
        code: 'onc-ca125',
        display: 'CA-125',
        system: 'athma-oncology',
        unit: 'U/mL',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'numeric',
      },
      {
        code: 'onc-cea',
        display: 'CEA Level',
        system: 'athma-oncology',
        unit: 'ng/mL',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'numeric',
      },
      {
        code: 'onc-afp',
        display: 'AFP Level',
        system: 'athma-oncology',
        unit: 'ng/mL',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'numeric',
      },
      {
        code: 'onc-ecog',
        display: 'ECOG Performance Status',
        system: 'athma-oncology',
        pluginId: context.pluginId,
        category: 'oncology',
        dataType: 'coded',
      },
    ]);

    context.extensionRegistry.registerChartingPanel({
      id: 'oncology-diagnosis-summary',
      name: 'Cancer Diagnosis Summary',
      pluginId: context.pluginId,
      encounterTypes: ['oncology_consult', 'chemotherapy_session', 'oncology_care_plan_review'],
      priority: 5,
      componentPath: 'oncology/CancerDiagnosisSummaryCard',
    });

    context.extensionRegistry.registerChartingPanel({
      id: 'oncology-staging-summary',
      name: 'Oncology Staging Summary',
      pluginId: context.pluginId,
      encounterTypes: ['oncology_consult', 'chemotherapy_session', 'oncology_care_plan_review'],
      priority: 10,
      componentPath: 'oncology/StagingSummaryPanel',
    });
  }
}
