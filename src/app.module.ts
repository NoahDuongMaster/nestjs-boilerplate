import envConfiguration, {
  envValidationSchema,
} from '@configurations/env.configuration';
import { ROUTES } from '@constants/routes.constant';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import { CoreModule } from '@modules/core/core.module';
import { HealthModule } from '@modules/health/health.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.STAGE === 'prod'
          ? '.env'
          : process.env.STAGE === 'staging'
            ? '.env.staging'
            : '.env.development',
      isGlobal: true,
      load: [envConfiguration],
      validationSchema: envValidationSchema,
    }),
    CoreModule,
    ...(process.env.MONGODB_URI
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
          }),
        ]
      : []),
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: 5,
      }),
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 20000,
      }),
    }),
    HealthModule,
    RouterModule.register([
      {
        path: ROUTES.COMMON.CHECK_HEALTH,
        module: HealthModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
