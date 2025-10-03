import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUserWithRoles(userId: string): Promise<any> {
    // TODO: Implement user with roles retrieval
    return {
      id: userId,
      email: 'user@example.com',
      tenantId: 'default-tenant',
    };
  }

  async getUserPermissions(userId: string): Promise<any> {
    // TODO: Implement user permissions retrieval
    return {
      roles: ['user'],
      permissions: ['read:profile'],
    };
  }
}
