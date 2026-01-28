import { foundationClient } from '@/lib/api/client';
import type {
  User,
  FacilityUser,
  UserWithFacility,
  CreateUserDTO,
  UpdateUserDTO,
  UserFacilityAccessResponse,
  AssignFacilityDTO,
  SetDefaultFacilityDTO,
} from '../types/user';

class UserService {
  async listByTenant(tenantId: string): Promise<User[]> {
    const response = await foundationClient.get('/users', {
      params: { tenantId },
    });
    return response.data;
  }

  async listByFacility(facilityId: string): Promise<FacilityUser[]> {
    const response = await foundationClient.get(`/facilities/${facilityId}/users`);
    return response.data.users;
  }

  async getById(id: string): Promise<User> {
    const response = await foundationClient.get(`/users/${id}`);
    return response.data;
  }

  async getUserFacilities(id: string): Promise<UserFacilityAccessResponse> {
    const response = await foundationClient.get(`/users/${id}/facilities`);
    return response.data;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const response = await foundationClient.post('/users', data);
    return response.data;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const response = await foundationClient.put(`/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await foundationClient.delete(`/users/${id}`);
  }

  async assignFacility(userId: string, data: AssignFacilityDTO): Promise<{ success: boolean }> {
    const response = await foundationClient.post(`/users/${userId}/facilities/assign`, data);
    return response.data;
  }

  async setDefaultFacility(userId: string, data: SetDefaultFacilityDTO): Promise<{ success: boolean }> {
    const response = await foundationClient.post(`/users/${userId}/facilities/set-default`, data);
    return response.data;
  }

  async revokeFacility(userId: string, facilityId: string): Promise<{ success: boolean }> {
    const response = await foundationClient.delete(`/users/${userId}/facilities/${facilityId}`);
    return response.data;
  }

  async linkStaff(userId: string, staffId: string): Promise<User> {
    const response = await foundationClient.patch(`/users/${userId}/staff`, { staffId });
    return response.data;
  }

  async unlinkStaff(userId: string): Promise<User> {
    const response = await foundationClient.patch(`/users/${userId}/staff`, { staffId: null });
    return response.data;
  }
}

export const userService = new UserService();
