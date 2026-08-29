import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { DEPARTMENT_MANAGE, DEPARTMENT_READ } from '@zeal/contracts';

@Controller('facilities/:facilityId/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Permissions(DEPARTMENT_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('facilityId') facilityId: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(facilityId, createDepartmentDto);
  }

  @Get()
  @Permissions(DEPARTMENT_READ)
  findAll(
    @Param('facilityId') facilityId: string,
    @Query('type') departmentType?: string,
  ) {
    return this.departmentService.findAll(facilityId, departmentType);
  }

  @Get(':id')
  @Permissions(DEPARTMENT_READ)
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @Permissions(DEPARTMENT_MANAGE)
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Permissions(DEPARTMENT_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}

// Standalone department controller for direct access
@Controller('departments')
export class DepartmentStandaloneController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get(':id')
  @Permissions(DEPARTMENT_READ)
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @Permissions(DEPARTMENT_MANAGE)
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Permissions(DEPARTMENT_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
