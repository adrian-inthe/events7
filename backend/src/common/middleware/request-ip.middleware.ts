import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../../models/users/users.service';

const randomSlovenianPublicIpForDevPurposes = '113.29.77.255';

@Injectable()
export class RequestIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    UsersService.userIp =
      process.env.NODE_ENV === 'development'
        ? randomSlovenianPublicIpForDevPurposes
        : req.ip;
    next();
  }
}
