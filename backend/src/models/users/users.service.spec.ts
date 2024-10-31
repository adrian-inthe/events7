import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let httpService: Partial<Record<keyof HttpService, jest.Mock>>;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('fetchUserCountryCode', () => {
    it('should return country code if user IP is set', async () => {
      UsersService.userIp = '123.45.67.89';
      httpService.get.mockReturnValueOnce(of({ data: { countryCode: 'SI' } }));
      expect(await (service as any).fetchUserCountryCode()).toBe('SI');
    });

    it('should return null if user IP is not present', async () => {
      UsersService.userIp = null;
      expect(await (service as any).fetchUserCountryCode()).toBeNull();
    });
  });

  describe('fetchPermission', () => {
    it('should return true if ads permission is granted', async () => {
      httpService.get.mockReturnValueOnce(
        of({ data: { ads: 'sure, why not!' } }),
      );
      expect(await service.fetchPermission('SI')).toBe(true);
    });

    it('should return false if ads permission is denied', async () => {
      httpService.get.mockReturnValueOnce(
        of({ data: { ads: 'you shall not pass!' } }),
      );
      expect(await service.fetchPermission('SI')).toBe(false);
    });

    it('should return null if ads response is unrecognized', async () => {
      httpService.get.mockReturnValueOnce(
        of({ data: { ads: 'unrecognized response' } }),
      );
      expect(await service.fetchPermission('SI')).toBeNull();
    });
  });

  describe('permissionToManipulateAds', () => {
    it('should return true if permission is granted', async () => {
      UsersService.userIp = '123.45.67.89';
      httpService.get
        .mockReturnValueOnce(of({ data: { countryCode: 'SI' } }))
        .mockReturnValueOnce(of({ data: { ads: 'sure, why not!' } }));
      expect(await service.permissionToManipulateAds()).toBe(true);
    });

    it('should return false if permission is denied', async () => {
      UsersService.userIp = '123.45.67.89';
      httpService.get
        .mockReturnValueOnce(of({ data: { countryCode: 'SI' } }))
        .mockReturnValueOnce(of({ data: { ads: 'you shall not pass!' } }));
      expect(await service.permissionToManipulateAds()).toBe(false);
    });

    it('should return false if permission response is unrecognized', async () => {
      UsersService.userIp = '123.45.67.89';
      httpService.get
        .mockReturnValueOnce(of({ data: { countryCode: 'SI' } }))
        .mockReturnValueOnce(of({ data: { ads: 'unrecognized response' } }));
      expect(await service.permissionToManipulateAds()).toBe(false);
    });

    it('should return false if no country code is found', async () => {
      UsersService.userIp = '123.45.67.89';
      httpService.get.mockReturnValueOnce(of({ data: {} }));
      expect(await service.permissionToManipulateAds()).toBe(false);
    });

    it('should return false if user IP is not present', async () => {
      UsersService.userIp = null;
      expect(await service.permissionToManipulateAds()).toBe(false);
    });
  });
});
