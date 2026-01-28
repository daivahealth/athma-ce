import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findByEmail(dto.tenantId, dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists in tenant');
    }

    // Validate staffId if provided
    if (dto.staffId) {
      await this.validateStaffMapping(dto.tenantId, dto.staffId);
    }

    const passwordHash = await argon2.hash(dto.password);
    const record = await this.userRepository.create({
      tenantId: dto.tenantId,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role: dto.role ?? 'user',
      ...(dto.staffId && { staffId: dto.staffId }),
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
    if (dto.status !== undefined) {
      updates.status = dto.status;
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

  /**
   * Link or unlink a user account to a staff member
   * @param userId - User ID
   * @param staffId - Staff ID to link (or null/undefined to unlink)
   */
  async linkStaff(userId: string, staffId?: string | null) {
    // Verify user exists
    const user = await this.getUser(userId);

    // If linking to staff, validate the staff member
    if (staffId) {
      await this.validateStaffMapping(user.tenantId, staffId, userId);
    }

    // Update the user's staffId
    return this.prisma.user.update({
      where: { id: userId },
      data: { staffId: staffId || null },
      include: {
        staff: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            displayName: true,
            staffType: true,
          },
        },
      },
    });
  }

  /**
   * Validates that a staff member exists and is not already linked to another user
   * @param tenantId - Tenant ID
   * @param staffId - Staff ID to validate
   * @param excludeUserId - Optional user ID to exclude from the check (for updates)
   */
  private async validateStaffMapping(
    tenantId: string,
    staffId: string,
    excludeUserId?: string,
  ) {
    // Check if staff exists
    const staff = await this.prisma.staff.findUnique({
      where: { id: staffId },
      select: { id: true, tenantId: true },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    if (staff.tenantId !== tenantId) {
      throw new BadRequestException('Staff member belongs to a different tenant');
    }

    // Check if staff is already linked to another user
    const existingUser = await this.prisma.user.findUnique({
      where: { staffId },
      select: { id: true, email: true },
    });

    if (existingUser && existingUser.id !== excludeUserId) {
      throw new ConflictException(
        `Staff member is already linked to user ${existingUser.email}`,
      );
    }
  }
}
