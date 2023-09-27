import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    auth(): string;
    signIn(signInDto: Record<string, any>): Promise<any>;
}
