import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SpecialtyService } from '../specialty.service';

const TENANT = '11111111-1111-1111-1111-111111111111';
const STAFF = '22222222-2222-2222-2222-222222222222';
const FACILITY = '33333333-3333-3333-3333-333333333333';
const SPECIALTY = '44444444-4444-4444-4444-444444444444';

function makeRepos() {
  const specialtyRepo: any = {
    findById: jest.fn(async () => ({ id: SPECIALTY, code: 'CARDIO', name: 'Cardiology', isActive: true })),
  };
  const staffSpecialtyRepo: any = {
    staffBelongsToTenant: jest.fn(async () => true),
    facilityBelongsToTenant: jest.fn(async () => true),
    getPrimarySpecialty: jest.fn(async () => null),
    getStaffSpecialties: jest.fn(async () => []),
    removeSpecialty: jest.fn(async () => ({ count: 1 })),
    changePrimarySpecialty: jest.fn(async () => ({ id: 'x', primaryFlag: true })),
    assignSpecialty: jest.fn(async () => ({ id: 'x', primaryFlag: false })),
    getFacilitySpecialties: jest.fn(async () => []),
  };
  return { specialtyRepo, staffSpecialtyRepo };
}

describe('SpecialtyService tenant scoping', () => {
  let repos: ReturnType<typeof makeRepos>;
  let service: SpecialtyService;

  beforeEach(() => {
    repos = makeRepos();
    service = new SpecialtyService(repos.specialtyRepo, repos.staffSpecialtyRepo);
  });

  it('rejects a missing tenant header', async () => {
    await expect(service.getStaffSpecialties('', STAFF)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 404 for staff in another tenant and never touches assignments', async () => {
    repos.staffSpecialtyRepo.staffBelongsToTenant.mockResolvedValue(false);

    await expect(service.getStaffSpecialties(TENANT, STAFF)).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.removeSpecialtyFromStaff(TENANT, STAFF, FACILITY, SPECIALTY)
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.changePrimarySpecialty(TENANT, STAFF, FACILITY, SPECIALTY)
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.assignSpecialtyToStaff(TENANT, STAFF, { facilityId: FACILITY, specialtyId: SPECIALTY })
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repos.staffSpecialtyRepo.getStaffSpecialties).not.toHaveBeenCalled();
    expect(repos.staffSpecialtyRepo.removeSpecialty).not.toHaveBeenCalled();
    expect(repos.staffSpecialtyRepo.changePrimarySpecialty).not.toHaveBeenCalled();
    expect(repos.staffSpecialtyRepo.assignSpecialty).not.toHaveBeenCalled();
  });

  it('returns 404 for a facility in another tenant', async () => {
    repos.staffSpecialtyRepo.facilityBelongsToTenant.mockResolvedValue(false);

    await expect(
      service.assignSpecialtyToStaff(TENANT, STAFF, { facilityId: FACILITY, specialtyId: SPECIALTY })
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.getFacilitySpecialties(TENANT, FACILITY)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('passes the tenant through to every repository call', async () => {
    await service.removeSpecialtyFromStaff(TENANT, STAFF, FACILITY, SPECIALTY);
    expect(repos.staffSpecialtyRepo.removeSpecialty).toHaveBeenCalledWith(
      TENANT,
      STAFF,
      FACILITY,
      SPECIALTY
    );

    await service.changePrimarySpecialty(TENANT, STAFF, FACILITY, SPECIALTY);
    expect(repos.staffSpecialtyRepo.changePrimarySpecialty).toHaveBeenCalledWith(
      TENANT,
      STAFF,
      FACILITY,
      SPECIALTY
    );

    await service.getFacilitySpecialties(TENANT, FACILITY);
    expect(repos.staffSpecialtyRepo.getFacilitySpecialties).toHaveBeenCalledWith(
      TENANT,
      FACILITY,
      undefined
    );
  });

  it('reports 404 when nothing was removed or the new primary is not assigned', async () => {
    repos.staffSpecialtyRepo.removeSpecialty.mockResolvedValue({ count: 0 });
    await expect(
      service.removeSpecialtyFromStaff(TENANT, STAFF, FACILITY, SPECIALTY)
    ).rejects.toBeInstanceOf(NotFoundException);

    repos.staffSpecialtyRepo.changePrimarySpecialty.mockResolvedValue(null);
    await expect(
      service.changePrimarySpecialty(TENANT, STAFF, FACILITY, SPECIALTY)
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
