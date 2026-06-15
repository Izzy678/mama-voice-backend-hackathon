import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { Token } from 'src/auth/dto/auth.dto';

export const TokenDataDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    const tokenData = response.locals.tokenData as
      | { token: Token; code: string; message: string }
      | undefined;
    return tokenData?.token;
  },
);

export const UseToken = () => SetMetadata('token', true);
