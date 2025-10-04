import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findByEmail(dto.tenantId, dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists in tenant');
    }

    const passwordHash = await argon2.hash(dto.password);
    const record = await this.userRepository.create({
      tenantId: dto.tenantId,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role: dto.role ?? 'user',
    });

    return record;
  }

  listUsers(tenantId: string) {
    return this.userRepository.findMany(tenantId);
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const current = await this.getUser(id);

    const updates: Partial<{
      firstName: string;
      lastName: string;
      role: string;
      status: string;
      passwordHash: string;
      email: string;
    }> = {};

    if (dto.firstName !== undefined) {
      updates.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      updates.lastName = dto.lastName;
    }
    if (dto.role !== undefined) {
      updates.role = dto.role;
    }
    if (dto.email !== undefined) {
      updates.email = dto.email;
    }

    if (dto.password) {
      updates.passwordHash = await argon2.hash(dto.password);
    }

    if (dto.tenantId || dto.email) {
      const targetTenant = dto.tenantId ?? current.tenantId;
      const targetEmail = dto.email ?? current.email;
      const conflict = await this.userRepository.findByEmail(targetTenant, targetEmail);
      if (conflict && conflict.id !== id) {
        throw new ConflictException('User with this email already exists in tenant');
      }
      if (dto.tenantId && dto.tenantId !== current.tenantId) {
        throw new ConflictException('Transferring users between tenants is not supported');
      }
    }

    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: string) {
    await this.getUser(id);
    await this.userRepository.delete(id);
  }
}
