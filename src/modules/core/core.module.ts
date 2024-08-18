import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@filters/all-exceptions.filter';
import { CoreController } from '@modules/core/core.controller';
import { AuthGuard } from '@guards/auth.guard';
import { TimeoutInterceptor } from '@interceptors/timeout.interceptor';

@Module({
  controllers: [CoreController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class CoreModule {}
