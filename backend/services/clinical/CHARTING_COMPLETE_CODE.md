# Complete Charting Module Implementation Code

This file contains all the remaining code needed for the charting module implementation.

## Services Created

✅ **Clinical Notes Service** - `/src/modules/charting/services/clinical-notes.service.ts` (COMPLETED)

## Remaining Services to Create

###  1. Diagnosis Service

**File**: `/src/modules/charting/services/diagnosis.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from '../dto/diagnosis.dto';

@Injectable()
export class DiagnosisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateDiagnosisDto) {
    return this.prisma.encounterDiagnosis.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const diagnosis = await this.prisma.encounterDiagnosis.findFirst({
      where: { id, tenantId },
    });
    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with ID ${id} not found`);
    }
    return diagnosis;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.encounterDiagnosis.findMany({
      where: { tenantId, encounterId },
      orderBy: [{ diagnosisRank: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    return this.prisma.encounterDiagnosis.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(tenantId: string, id: string, dto: UpdateDiagnosisDto) {
    await this.findById(tenantId, id);
    return this.prisma.encounterDiagnosis.update({
      where: { id },
      data: dto,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.encounterDiagnosis.delete({ where: { id } });
    return { message: 'Diagnosis deleted successfully' };
  }
}
```

### 2. Clinical Orders Service

**File**: `/src/modules/charting/services/clinical-orders.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateClinicalOrderDto, UpdateClinicalOrderDto, AddOrderResultDto, OrderStatus } from '../dto/clinical-order.dto';

@Injectable()
export class ClinicalOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateClinicalOrderDto) {
    return this.prisma.clinicalOrder.create({
      data: {
        tenantId,
        ...dto,
        priority: dto.priority || 'routine',
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id, tenantId },
    });
    if (!order) {
      throw new NotFoundException(`Clinical order with ID ${id} not found`);
    }
    return order;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.clinicalOrder.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    return this.prisma.clinicalOrder.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(tenantId: string, id: string, dto: UpdateClinicalOrderDto) {
    await this.findById(tenantId, id);
    return this.prisma.clinicalOrder.update({
      where: { id },
      data: dto,
    });
  }

  async addResults(tenantId: string, id: string, dto: AddOrderResultDto) {
    const order = await this.findById(tenantId, id);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot add results to a cancelled order');
    }

    return this.prisma.clinicalOrder.update({
      where: { id },
      data: {
        resultStatus: dto.resultStatus,
        resultData: dto.resultData,
        resultNotes: dto.resultNotes,
        performedBy: dto.performedBy,
        performedAt: dto.performedAt ? new Date(dto.performedAt) : undefined,
        resultedAt: new Date(),
        status: OrderStatus.COMPLETED,
      },
    });
  }

  async cancel(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.clinicalOrder.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.clinicalOrder.delete({ where: { id } });
    return { message: 'Clinical order deleted successfully' };
  }
}
```

### 3. Prescriptions Service

**File**: `/src/modules/charting/services/prescriptions.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreatePrescriptionDto, UpdatePrescriptionDto, PrescriptionStatus } from '../dto/prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePrescriptionDto) {
    return this.prisma.prescriptionOrder.create({
      data: {
        tenantId,
        ...dto,
        codeSystem: dto.codeSystem || 'NDC',
        refills: dto.refills || 0,
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const prescription = await this.prisma.prescriptionOrder.findFirst({
      where: { id, tenantId },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    return prescription;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.prescriptionOrder.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, activeOnly: boolean = false) {
    return this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        patientId,
        ...(activeOnly ? { status: PrescriptionStatus.ACTIVE } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdatePrescriptionDto) {
    await this.findById(tenantId, id);
    return this.prisma.prescriptionOrder.update({
      where: { id },
      data: dto,
    });
  }

  async discontinue(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.prescriptionOrder.update({
      where: { id },
      data: { status: PrescriptionStatus.DISCONTINUED },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.prescriptionOrder.delete({ where: { id } });
    return { message: 'Prescription deleted successfully' };
  }
}
```

## Controllers to Create

### 1. Clinical Notes Controller

**File**: `/src/modules/charting/controllers/clinical-notes.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalNotesService } from '../services/clinical-notes.service';
import {
  CreateClinicalNoteDto,
  UpdateClinicalNoteDto,
  UpdateNoteSectionsDto,
  SignNoteDto,
  ClinicalNoteResponseDto,
} from '../dto/clinical-note.dto';

@ApiTags('Clinical Notes')
@ApiBearerAuth()
@Controller('clinical-notes')
export class ClinicalNotesController {
  constructor(private readonly clinicalNotesService: ClinicalNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical note' })
  @ApiResponse({ status: 201, description: 'Clinical note created successfully', type: ClinicalNoteResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateClinicalNoteDto,
  ) {
    return this.clinicalNotesService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical note by ID' })
  @ApiResponse({ status: 200, description: 'Clinical note found', type: ClinicalNoteResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalNotesService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all clinical notes for an encounter' })
  @ApiResponse({ status: 200, description: 'Clinical notes retrieved', type: [ClinicalNoteResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalNotesService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all clinical notes for a patient' })
  @ApiResponse({ status: 200, description: 'Clinical notes retrieved', type: [ClinicalNoteResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicalNotesService.findByPatient(tenantId, patientId, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clinical note metadata' })
  @ApiResponse({ status: 200, description: 'Clinical note updated', type: ClinicalNoteResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClinicalNoteDto,
  ) {
    return this.clinicalNotesService.update(tenantId, id, dto);
  }

  @Put(':id/sections')
  @ApiOperation({ summary: 'Update clinical note sections' })
  @ApiResponse({ status: 200, description: 'Sections updated', type: ClinicalNoteResponseDto })
  async updateSections(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteSectionsDto,
  ) {
    return this.clinicalNotesService.updateSections(tenantId, id, dto);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign a clinical note' })
  @ApiResponse({ status: 200, description: 'Note signed successfully', type: ClinicalNoteResponseDto })
  async signNote(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: SignNoteDto,
  ) {
    return this.clinicalNotesService.signNote(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinical note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalNotesService.delete(tenantId, id);
  }

  @Get('encounter/:encounterId/statistics')
  @ApiOperation({ summary: 'Get notes statistics for an encounter' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalNotesService.getNotesStatistics(tenantId, encounterId);
  }
}
```

### 2. Diagnosis Controller

**File**: `/src/modules/charting/controllers/diagnosis.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiagnosisService } from '../services/diagnosis.service';
import { CreateDiagnosisDto, UpdateDiagnosisDto, DiagnosisResponseDto } from '../dto/diagnosis.dto';

@ApiTags('Diagnoses')
@ApiBearerAuth()
@Controller('diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  @ApiOperation({ summary: 'Add a diagnosis to encounter' })
  @ApiResponse({ status: 201, description: 'Diagnosis added successfully', type: DiagnosisResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateDiagnosisDto,
  ) {
    return this.diagnosisService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diagnosis by ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis found', type: DiagnosisResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.diagnosisService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all diagnoses for an encounter' })
  @ApiResponse({ status: 200, description: 'Diagnoses retrieved', type: [DiagnosisResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.diagnosisService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all diagnoses for a patient' })
  @ApiResponse({ status: 200, description: 'Diagnoses retrieved', type: [DiagnosisResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.diagnosisService.findByPatient(tenantId, patientId, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis updated', type: DiagnosisResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDiagnosisDto,
  ) {
    return this.diagnosisService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.diagnosisService.delete(tenantId, id);
  }
}
```

### 3. Clinical Orders Controller

**File**: `/src/modules/charting/controllers/clinical-orders.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalOrdersService } from '../services/clinical-orders.service';
import {
  CreateClinicalOrderDto,
  UpdateClinicalOrderDto,
  AddOrderResultDto,
  ClinicalOrderResponseDto,
} from '../dto/clinical-order.dto';

@ApiTags('Clinical Orders')
@ApiBearerAuth()
@Controller('clinical-orders')
export class ClinicalOrdersController {
  constructor(private readonly clinicalOrdersService: ClinicalOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical order (lab, imaging, procedure)' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: ClinicalOrderResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateClinicalOrderDto,
  ) {
    return this.clinicalOrdersService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: ClinicalOrderResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalOrdersService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all orders for an encounter' })
  @ApiResponse({ status: 200, description: 'Orders retrieved', type: [ClinicalOrderResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalOrdersService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all orders for a patient' })
  @ApiResponse({ status: 200, description: 'Orders retrieved', type: [ClinicalOrderResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicalOrdersService.findByPatient(tenantId, patientId, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order details' })
  @ApiResponse({ status: 200, description: 'Order updated', type: ClinicalOrderResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClinicalOrderDto,
  ) {
    return this.clinicalOrdersService.update(tenantId, id, dto);
  }

  @Put(':id/results')
  @ApiOperation({ summary: 'Add order results' })
  @ApiResponse({ status: 200, description: 'Results added', type: ClinicalOrderResponseDto })
  async addResults(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AddOrderResultDto,
  ) {
    return this.clinicalOrdersService.addResults(tenantId, id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled', type: ClinicalOrderResponseDto })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalOrdersService.cancel(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalOrdersService.delete(tenantId, id);
  }
}
```

### 4. Prescriptions Controller

**File**: `/src/modules/charting/controllers/prescriptions.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from '../services/prescriptions.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionResponseDto,
} from '../dto/prescription.dto';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully', type: PrescriptionResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription found', type: PrescriptionResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all prescriptions for an encounter' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved', type: [PrescriptionResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.prescriptionsService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all prescriptions for a patient (active medications)' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved', type: [PrescriptionResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    return this.prescriptionsService.findByPatient(tenantId, patientId, activeOnly);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prescription details' })
  @ApiResponse({ status: 200, description: 'Prescription updated', type: PrescriptionResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(tenantId, id, dto);
  }

  @Post(':id/discontinue')
  @ApiOperation({ summary: 'Discontinue a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription discontinued', type: PrescriptionResponseDto })
  async discontinue(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.discontinue(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.delete(tenantId, id);
  }
}
```

## Module File

**File**: `/src/modules/charting/charting.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { ClinicalNotesService } from './services/clinical-notes.service';
import { DiagnosisService } from './services/diagnosis.service';
import { ClinicalOrdersService } from './services/clinical-orders.service';
import { PrescriptionsService } from './services/prescriptions.service';

// Controllers
import { ClinicalNotesController } from './controllers/clinical-notes.controller';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { ClinicalOrdersController } from './controllers/clinical-orders.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';

@Module({
  imports: [],
  controllers: [
    ClinicalNotesController,
    DiagnosisController,
    ClinicalOrdersController,
    PrescriptionsController,
  ],
  providers: [
    PrismaService,
    ClinicalNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
  exports: [
    ClinicalNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
})
export class ChartingModule {}
```

## App Module Integration

Add to `/src/app.module.ts`:

```typescript
import { ChartingModule } from './modules/charting/charting.module';

@Module({
  imports: [
    // ... other modules
    ChartingModule,
  ],
  // ...
})
export class AppModule {}
```

## Testing the Implementation

Once all files are created, test with:

```bash
# Navigate to clinical service
cd backend/services/clinical

# Install dependencies (if needed)
npm install

# Start the service
npm run dev

# Service should start on port 3011
# Swagger docs: http://localhost:3011/api/docs
```

## API Testing Examples

### Create a SOAP Note
```bash
curl -X POST http://localhost:3011/api/v1/clinical-notes \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -H "x-user-id: YOUR_USER_ID" \
  -H "x-facility-id: YOUR_FACILITY_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "encounterId": "encounter-uuid",
    "patientId": "patient-uuid",
    "noteType": "soap",
    "language": "en",
    "authorStaffId": "staff-uuid",
    "sections": [
      {
        "sectionCode": "subjective",
        "sectionName": "Subjective",
        "content": {"text": "Patient reports feeling better"},
        "sortOrder": 1
      }
    ]
  }'
```

### Add a Diagnosis
```bash
curl -X POST http://localhost:3011/api/v1/diagnoses \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -d '{
    "encounterId": "encounter-uuid",
    "patientId": "patient-uuid",
    "icdCode": "J45.0",
    "diagnosisName": "Allergic asthma",
    "diagnosisType": "primary",
    "diagnosisRank": 1,
    "diagnosedBy": "staff-uuid"
  }'
```

## Next Steps

1. Create all the service files from this document
2. Create all the controller files from this document
3. Create the charting.module.ts file
4. Update app.module.ts to import ChartingModule
5. Test the endpoints using Swagger or Postman
6. Add unit tests for services
7. Add integration tests for controllers
