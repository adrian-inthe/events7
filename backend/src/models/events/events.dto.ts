import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export enum Event7Type {
  CrossPromo = 'crosspromo',
  LiveOps = 'liveops',
  App = 'app',
  Ads = 'ads',
}

export class CreateEvent7Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Event7Type, {
    message: 'Must be one of: crosspromo, liveops, app, ads',
  })
  @IsNotEmpty()
  type: Event7Type;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(10)
  priority: number;
}

export class Event7Dto extends CreateEvent7Dto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;
}
