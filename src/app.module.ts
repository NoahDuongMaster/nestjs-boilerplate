import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@modules/core/core.module';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envConfiguration, {
  envValidationSchema,
} from '@configurations/env.configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { RouterModule } from '@nestjs/core';
import { HealthModule } from '@modules/health/health.module';
import { ROUTES } from '@constants/routes.constant';

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
