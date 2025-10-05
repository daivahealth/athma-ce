import { Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';
import { JwtPayload, JwtClaims } from '@zeal/contracts';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<JwtClaims>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map