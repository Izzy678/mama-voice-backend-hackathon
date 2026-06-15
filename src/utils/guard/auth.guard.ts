import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Token } from 'src/auth/dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const response: Response = context.switchToHttp().getResponse();
        const tokenData = response.locals.tokenData as Token;
        if (!tokenData) {
            throw new UnauthorizedException(
                'You are not authorized to access this resource',
            );
        }
        if (!tokenData) {
            throw new UnauthorizedException(
                'you are not authroized to access this resource',
            );
        }
        return true;
    }
}
