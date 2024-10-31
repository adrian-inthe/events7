import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  private readonly permissionApiKey: string;
  private readonly permissionApiSecret: string;
  private readonly permissionsEndpoint = `https://us-central1-o7tools.cloudfunctions.net/fun7-ad-partner`;
  private readonly geolocationEndpoint = `http://ip-api.com/json`; // TODO use a HTTPS endpoint

  constructor(private readonly httpService: HttpService) {
    this.permissionApiKey = process.env.PERMISSIONS_API_KEY;
    this.permissionApiSecret = process.env.PERMISSIONS_API_SECRET;
  }

  async permissionToManipulateAds(): Promise<boolean> {
    const countryCode = await this.fetchUserCountryCode();
    if (countryCode) {
      const permissionGranted: boolean | null =
        await this.fetchPermission(countryCode);
      if (permissionGranted === null) {
        console.warn('Permission not found, permission denied');
        return false;
      } else {
        return permissionGranted;
      }
    } else {
      console.warn('No country code found, permission denied');
      return false;
    }
  }

  async fetchPermission(countryCode: string): Promise<boolean | null> {
    const permissionGrantedResponse = 'sure, why not!';
    const permissionDeniedResponse = 'you shall not pass!';

    try {
      const basicAuth = Buffer.from(
        `${this.permissionApiKey}:${this.permissionApiSecret}`,
      ).toString('base64');

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.permissionsEndpoint}?countryCode=${countryCode}`,
          {
            headers: { Authorization: `Basic ${basicAuth}` },
          },
        ),
      );

      if (
        !response.data.ads ||
        ![permissionGrantedResponse, permissionDeniedResponse].includes(
          response.data.ads,
        )
      ) {
        throw new Error('Unrecognized response');
      }

      return response.data.ads === permissionGrantedResponse;
    } catch (error) {
      console.error("Couldn't fetch permission", error);
      return null;
    }
  }

  private async fetchUserCountryCode(): Promise<string | null> {
    const tempIp = "113.29.77.255";
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.geolocationEndpoint}/${tempIp}?fields=countryCode`,
        ),
      );
      return response.data.countryCode;
    } catch (error) {
      console.error("Couldn't fetch country code", error);
      return null;
    }
  }
}
