import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserSearchDto, ChangePasswordDto, UserStatsDto } from './dto/user.dto';
import { ApiResponse as ApiResponseType, PaginationParams } from '@zeal/contracts';
import { User } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<ApiResponseType<User>>;
    findAll(tenantId: string, searchDto: UserSearchDto, pagination: PaginationParams): Promise<ApiResponseType<User[]>>;
    getUsersByRole(tenantId: string, role: string): Promise<ApiResponseType<User[]>>;
    getUserStats(tenantId: string): Promise<ApiResponseType<UserStatsDto>>;
    findOne(id: string): Promise<ApiResponseType<User>>;
    findByEmail(tenantId: string, email: string): Promise<ApiResponseType<User>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponseType<User>>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ApiResponseType<void>>;
    remove(id: string): Promise<void>;
    checkExists(id: string): Promise<ApiResponseType<{
        exists: boolean;
    }>>;
    checkEmailExists(tenantId: string, email: string): Promise<ApiResponseType<{
        exists: boolean;
    }>>;
}
//# sourceMappingURL=user.controller.d.ts.map