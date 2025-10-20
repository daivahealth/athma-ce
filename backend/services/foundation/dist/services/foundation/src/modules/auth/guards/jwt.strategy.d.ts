import { JwtPayload, JwtClaims } from '@zeal/contracts';
import { UserService } from '../services/user.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<JwtClaims>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map