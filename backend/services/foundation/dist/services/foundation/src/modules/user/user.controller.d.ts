import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
    listUsers(tenantId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }[]>;
    getUser(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
    deleteUser(id: string): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map