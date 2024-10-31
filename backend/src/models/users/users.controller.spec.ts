import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: HttpService, useValue: {} }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should return the correct permissions for ads events', async () => {
    jest
      .spyOn(service, 'permissionToManipulateAds')
      .mockImplementation(() => Promise.resolve(true));
    expect(await controller.checkAdsPermission()).toEqual({
      canCreateAdsEvents: true,
    });
    expect(service.permissionToManipulateAds).toHaveBeenCalled();

    jest
      .spyOn(service, 'permissionToManipulateAds')
      .mockImplementation(() => Promise.resolve(false));
    expect(await controller.checkAdsPermission()).toEqual({
      canCreateAdsEvents: false,
    });
  });
});
