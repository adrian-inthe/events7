import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './models/events/events.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [EventsModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
}
