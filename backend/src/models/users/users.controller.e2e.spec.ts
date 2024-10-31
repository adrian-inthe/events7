import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const usersService = { permissionToManipulateAds: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: HttpService, useValue: {} },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/permissions/ads (GET) returns the permission', async () => {
    usersService.permissionToManipulateAds.mockResolvedValue(true);
    await request(app.getHttpServer())
      .get('/users/permissions/ads')
      .expect(200)
      .expect({
        canCreateAdsEvents: true,
      });
    expect(usersService.permissionToManipulateAds).toHaveBeenCalled();

    usersService.permissionToManipulateAds.mockResolvedValue(false);
    await request(app.getHttpServer())
      .get('/users/permissions/ads')
      .expect(200)
      .expect({
        canCreateAdsEvents: false,
      });
  });
});
