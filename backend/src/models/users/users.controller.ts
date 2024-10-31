import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users/permissions')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('ads')
  async checkAdsPermission() {
    return {
      canCreateAdsEvents: await this.usersService.permissionToManipulateAds(),
    };
  }
}
