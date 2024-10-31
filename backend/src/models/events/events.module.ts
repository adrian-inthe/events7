import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [EventsService],
})
export class EventsModule {}
