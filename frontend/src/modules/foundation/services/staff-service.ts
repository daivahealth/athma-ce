import { foundationClient } from '@/lib/api/client';
import type { StaffMember } from '../types/staff';

export interface CreateStaffDTO {
  prefix?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  email?: string;
  employeeId: string;
  staffType: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  qualification?: string;
  languages?: string[];
}

class StaffService {
  async list(): Promise<StaffMember[]> {
    const response = await foundationClient.get('/staff');
    return response.data;
  }

  async getById(id: string): Promise<StaffMember> {
    const response = await foundationClient.get(`/staff/${id}`);
    return response.data;
  }

  async create(data: CreateStaffDTO): Promise<StaffMember> {
    const response = await foundationClient.post('/staff', data);
    return response.data;
  }
}

export const staffService = new StaffService();
