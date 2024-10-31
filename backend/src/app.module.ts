import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './models/events/events.module';
import { UsersModule } from './models/users/users.module';
import { RequestIpMiddleware } from './common/middleware/request-ip.middleware';

@Module({
  imports: [EventsModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIpMiddleware).forRoutes('*');
  }
}
