import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SpecialtyRepository } from './specialty.repository';
import { StaffSpecialtyRepository } from './staff-specialty.repository';
import { AssignSpecialtyDto, BulkAssignSpecialtiesDto } from './dto/assign-specialty.dto';
import { SearchStaffBySpecialtyDto } from './dto/search-staff.dto';

@Injectable()
export class SpecialtyService {
  constructor(
    private readonly specialtyRepo: SpecialtyRepository,
    private readonly staffSpecialtyRepo: StaffSpecialtyRepository
  ) {}

  // =====================================================
  // Specialty Management
  // =====================================================

  async getAllSpecialties(includeInactive = false, locale?: string) {
    const specialties = await this.specialtyRepo.findAll(includeInactive);

    // Format with localized names
    return specialties.map((specialty) => ({
      ...specialty,
      localizedName: this.getLocalizedName(specialty, locale),
    }));
  }

  async getSpecialtyByCode(code: string, locale?: string) {
    const specialty = await this.specialtyRepo.findByCode(code);
    if (!specialty) {
      throw new NotFoundException(`Specialty with code ${code} not found`);
    }

    return {
      ...specialty,
      localizedName: this.getLocalizedName(specialty, locale),
    };
  }

  async getSpecialtyById(id: string, locale?: string) {
    const specialty = await this.specialtyRepo.findById(id);
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    return {
      ...specialty,
      localizedName: this.getLocalizedName(specialty, locale),
    };
  }

  // =====================================================
  // Staff Specialty Assignment
  // =====================================================

  /**
   * Rejects requests that reference a staff member (and optionally a facility)
   * outside the caller's tenant. Responds 404 so other tenants' IDs are not disclosed.
   */
  private async assertTenantOwnership(tenantId: string, staffId: string, facilityId?: string) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    if (!(await this.staffSpecialtyRepo.staffBelongsToTenant(tenantId, staffId))) {
      throw new NotFoundException(`Staff ${staffId} not found`);
    }
    if (facilityId && !(await this.staffSpecialtyRepo.facilityBelongsToTenant(tenantId, facilityId))) {
      throw new NotFoundException(`Facility ${facilityId} not found`);
    }
  }

  async assignSpecialtyToStaff(
    tenantId: string,
    staffId: string,
    dto: AssignSpecialtyDto
  ) {
    await this.assertTenantOwnership(tenantId, staffId, dto.facilityId);

    // Verify specialty exists
    const specialty = await this.specialtyRepo.findById(dto.specialtyId);
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${dto.specialtyId} not found`);
    }

    if (!specialty.isActive) {
      throw new BadRequestException('Cannot assign inactive specialty');
    }

    // Assign specialty
    const staffSpecialty = await this.staffSpecialtyRepo.assignSpecialty({
      tenantId,
      staffId,
      facilityId: dto.facilityId,
      specialtyId: dto.specialtyId,
      primaryFlag: dto.primaryFlag || false,
    });

    return {
      success: true,
      staffSpecialty,
      message: dto.primaryFlag
        ? 'Primary specialty assigned successfully'
        : 'Secondary specialty assigned successfully',
    };
  }

  async removeSpecialtyFromStaff(
    tenantId: string,
    staffId: string,
    facilityId: string,
    specialtyId: string
  ) {
    await this.assertTenantOwnership(tenantId, staffId, facilityId);

    // Check if it's the primary specialty
    const primary = await this.staffSpecialtyRepo.getPrimarySpecialty(tenantId, staffId, facilityId);
    if (primary && primary.specialtyId === specialtyId) {
      const allSpecialties = await this.staffSpecialtyRepo.getStaffSpecialties(
        tenantId,
        staffId,
        facilityId
      );

      if (allSpecialties.length <= 1) {
        throw new BadRequestException(
          'Cannot remove the only specialty. Staff must have at least one specialty per facility.'
        );
      }

      throw new BadRequestException(
        'Cannot remove primary specialty. Please set another specialty as primary first.'
      );
    }

    const result = await this.staffSpecialtyRepo.removeSpecialty(
      tenantId,
      staffId,
      facilityId,
      specialtyId
    );
    if (result.count === 0) {
      throw new NotFoundException('Staff specialty assignment not found');
    }

    return {
      success: true,
      message: 'Specialty removed successfully',
    };
  }

  async changePrimarySpecialty(
    tenantId: string,
    staffId: string,
    facilityId: string,
    newPrimarySpecialtyId: string
  ) {
    await this.assertTenantOwnership(tenantId, staffId, facilityId);

    const newPrimary = await this.staffSpecialtyRepo.changePrimarySpecialty(
      tenantId,
      staffId,
      facilityId,
      newPrimarySpecialtyId
    );
    if (!newPrimary) {
      throw new NotFoundException(
        'Specialty not found or not assigned to staff member at this facility'
      );
    }

    return {
      success: true,
      primarySpecialty: newPrimary,
      message: 'Primary specialty changed successfully',
    };
  }

  async bulkAssignSpecialties(
    tenantId: string,
    staffId: string,
    dto: BulkAssignSpecialtiesDto
  ) {
    await this.assertTenantOwnership(tenantId, staffId, dto.facilityId);

    // Verify all specialties exist
    const primary = await this.specialtyRepo.findById(dto.primarySpecialtyId);
    if (!primary || !primary.isActive) {
      throw new BadRequestException('Invalid primary specialty');
    }

    if (dto.secondarySpecialtyIds && dto.secondarySpecialtyIds.length > 0) {
      const secondaries = await Promise.all(
        dto.secondarySpecialtyIds.map((id) => this.specialtyRepo.findById(id))
      );

      if (secondaries.some((s) => !s || !s.isActive)) {
        throw new BadRequestException('One or more secondary specialties are invalid');
      }

      // Check for duplicates
      if (dto.secondarySpecialtyIds.includes(dto.primarySpecialtyId)) {
        throw new BadRequestException(
          'Primary specialty cannot also be in secondary specialties'
        );
      }
    }

    // Bulk assign
    const assignData: any = {
      tenantId,
      staffId,
      facilityId: dto.facilityId,
      primarySpecialtyId: dto.primarySpecialtyId,
    };
    
    if (dto.secondarySpecialtyIds) {
      assignData.secondarySpecialtyIds = dto.secondarySpecialtyIds;
    }
    
    const result = await this.staffSpecialtyRepo.bulkAssignSpecialties(assignData);

    return {
      success: true,
      ...result,
      message: 'Specialties assigned successfully',
    };
  }

  async getStaffSpecialties(
    tenantId: string,
    staffId: string,
    facilityId?: string,
    locale?: string
  ) {
    await this.assertTenantOwnership(tenantId, staffId);

    const staffSpecialties = await this.staffSpecialtyRepo.getStaffSpecialties(
      tenantId,
      staffId,
      facilityId,
      locale
    );

    return staffSpecialties.map((ss: any) => ({
      id: ss.id,
      facilityId: ss.facilityId,
      facilityName: ss.facility?.name,
      specialtyId: ss.specialtyId,
      specialtyCode: ss.specialty.code,
      specialtyName: this.getLocalizedName(ss.specialty, locale),
      isPrimary: ss.primaryFlag,
      assignedAt: ss.createdAt,
      specialty: {
        ...ss.specialty,
        localizedName: this.getLocalizedName(ss.specialty, locale),
      },
    }));
  }

  // =====================================================
  // Specialty-Based Doctor Search
  // =====================================================

  async searchStaffBySpecialty(tenantId: string, dto: SearchStaffBySpecialtyDto) {
    if (!dto.specialtyId && !dto.specialtyCode) {
      throw new BadRequestException('Either specialtyId or specialtyCode must be provided');
    }

    const searchParams: any = {
      tenantId,
      primaryOnly: dto.primaryOnly ?? true,
      activeOnly: dto.activeOnly ?? true,
    };
    
    if (dto.specialtyId) searchParams.specialtyId = dto.specialtyId;
    if (dto.specialtyCode) searchParams.specialtyCode = dto.specialtyCode;
    if (dto.staffType) searchParams.staffType = dto.staffType;
    if (dto.facilityId) searchParams.facilityId = dto.facilityId;
    if (dto.locale) searchParams.locale = dto.locale;
    
    const results = await this.staffSpecialtyRepo.findStaffBySpecialty(searchParams);

    return results.map((result: any) => ({
      staffId: result.staffId,
      employee: {
        employeeId: result.staff.employeeId,
        firstName: result.staff.firstName,
        lastName: result.staff.lastName,
        fullName: `${result.staff.firstName} ${result.staff.lastName}`,
        staffType: result.staff.staffType,
        phoneNumber: result.staff.phoneNumber,
        email: result.staff.email,
        licenseNumber: result.staff.licenseNumber,
        licenseExpiry: result.staff.licenseExpiry,
        status: result.staff.status,
      },
      specialty: {
        id: result.specialty.id,
        code: result.specialty.code,
        name: this.getLocalizedName(result.specialty, dto.locale),
        isPrimary: result.primaryFlag,
      },
      hasSystemAccess: !!result.staff.user,
      userEmail: result.staff.user?.email,
      departments: result.staff.departments,
      assignedAt: result.createdAt,
    }));
  }

  async getSpecialtyStats(tenantId: string, locale?: string) {
    const stats = await this.staffSpecialtyRepo.getSpecialtyStats(tenantId);

    return stats.map((stat) => ({
      specialty: {
        id: stat.specialty?.id,
        code: stat.specialty?.code,
        name: stat.specialty ? this.getLocalizedName(stat.specialty, locale) : 'Unknown',
      },
      activeStaffCount: stat.count,
    }));
  }

  async getFacilitySpecialties(tenantId: string, facilityId: string, locale?: string) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    if (!(await this.staffSpecialtyRepo.facilityBelongsToTenant(tenantId, facilityId))) {
      throw new NotFoundException(`Facility ${facilityId} not found`);
    }

    const specialties = await this.staffSpecialtyRepo.getFacilitySpecialties(
      tenantId,
      facilityId,
      locale
    );

    return specialties.map((item: any) => ({
      specialty: {
        id: item.specialty?.id,
        code: item.specialty?.code,
        name: item.specialty?.name,
        localizedName: this.getLocalizedName(item.specialty, locale),
        authorityCodes: item.specialty?.authorityCodes,
      },
      staffCount: item.staffCount,
      staff: item.staff,
    }));
  }

  // =====================================================
  // Utility Methods
  // =====================================================

  private getLocalizedName(specialty: any, locale?: string): string {
    if (!locale || locale === 'en') {
      return specialty.name;
    }

    const translation = specialty.translations?.find((t: any) => t.lang === locale);
    return translation?.displayName || specialty.name;
  }
}
