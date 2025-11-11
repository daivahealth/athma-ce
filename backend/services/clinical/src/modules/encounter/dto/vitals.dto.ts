import { IsNumber, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating vital signs
 */
export class UpdateVitalsDto {
  // Temperature
  @ApiPropertyOptional({ description: 'Body temperature in Celsius', example: 37.2 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(45)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Temperature unit', example: 'celsius', enum: ['celsius', 'fahrenheit'] })
  @IsOptional()
  @IsString()
  temperatureUnit?: 'celsius' | 'fahrenheit';

  // Blood Pressure
  @ApiPropertyOptional({ description: 'Systolic blood pressure (mmHg)', example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  systolicBP?: number;

  @ApiPropertyOptional({ description: 'Diastolic blood pressure (mmHg)', example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(150)
  diastolicBP?: number;

  // Heart Rate
  @ApiPropertyOptional({ description: 'Heart rate (beats per minute)', example: 72 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  heartRate?: number;

  // Respiratory Rate
  @ApiPropertyOptional({ description: 'Respiratory rate (breaths per minute)', example: 16 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(60)
  respiratoryRate?: number;

  // Oxygen Saturation
  @ApiPropertyOptional({ description: 'Oxygen saturation (%)', example: 98 })
  @IsOptional()
  @IsNumber()
  @Min(70)
  @Max(100)
  oxygenSaturation?: number;

  // Weight
  @ApiPropertyOptional({ description: 'Weight in kilograms', example: 70.5 })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(500)
  weight?: number;

  @ApiPropertyOptional({ description: 'Weight unit', example: 'kg', enum: ['kg', 'lbs'] })
  @IsOptional()
  @IsString()
  weightUnit?: 'kg' | 'lbs';

  // Height
  @ApiPropertyOptional({ description: 'Height in centimeters', example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  height?: number;

  @ApiPropertyOptional({ description: 'Height unit', example: 'cm', enum: ['cm', 'in'] })
  @IsOptional()
  @IsString()
  heightUnit?: 'cm' | 'in';

  // BMI (can be calculated or manually entered)
  @ApiPropertyOptional({ description: 'Body Mass Index', example: 23.0 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(60)
  bmi?: number;

  // Pain Scale
  @ApiPropertyOptional({ description: 'Pain scale (0-10)', example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  painScale?: number;

  // Blood Glucose
  @ApiPropertyOptional({ description: 'Blood glucose level (mg/dL)', example: 95 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(600)
  bloodGlucose?: number;

  @ApiPropertyOptional({ description: 'Blood glucose unit', example: 'mg/dL', enum: ['mg/dL', 'mmol/L'] })
  @IsOptional()
  @IsString()
  bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';

  // Head Circumference (for pediatric)
  @ApiPropertyOptional({ description: 'Head circumference in cm (pediatric)', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(70)
  headCircumference?: number;

  // Notes
  @ApiPropertyOptional({ description: 'Additional vitals notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  // Recording metadata
  @ApiPropertyOptional({ description: 'Date and time vitals were recorded' })
  @IsOptional()
  @IsDateString()
  recordedAt?: string;

  @ApiPropertyOptional({ description: 'Staff ID who recorded vitals' })
  @IsOptional()
  @IsString()
  recordedBy?: string;
}

/**
 * Response DTO for vitals
 */
export class VitalsResponseDto {
  @ApiProperty()
  temperature?: number;

  @ApiProperty()
  temperatureUnit?: string;

  @ApiProperty()
  systolicBP?: number;

  @ApiProperty()
  diastolicBP?: number;

  @ApiProperty()
  heartRate?: number;

  @ApiProperty()
  respiratoryRate?: number;

  @ApiProperty()
  oxygenSaturation?: number;

  @ApiProperty()
  weight?: number;

  @ApiProperty()
  weightUnit?: string;

  @ApiProperty()
  height?: number;

  @ApiProperty()
  heightUnit?: string;

  @ApiProperty()
  bmi?: number;

  @ApiProperty()
  painScale?: number;

  @ApiProperty()
  bloodGlucose?: number;

  @ApiProperty()
  bloodGlucoseUnit?: string;

  @ApiProperty()
  headCircumference?: number;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  recordedAt?: Date | string;

  @ApiProperty()
  recordedBy?: string;
}
