import { join } from 'path';
import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from './app.module';
import { FULL_VI_DATE_FORMAT } from './constants/date.constant';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'dd/mm/yyyy, HH:MM:ss',
            ignore: 'id',
          },
        },
      },
      genReqId: () => uuidv4(),
      disableRequestLogging: true,
    }),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.addHook('onRequest', (req, reply, done) => {
    (reply as any).startTime = dayjs().valueOf();
    req.log.info(
      {
        url: req.raw.url,
        id: req.id,
        time: dayjs().format(FULL_VI_DATE_FORMAT),
        ip: req.ip,
      },
      'received request.',
    );
    done();
  });

  fastifyInstance.addHook('onResponse', (req, reply, done) => {
    req.log.info(
      {
        url: req.raw.url,
        statusCode: reply.raw.statusCode,
        duration: `${dayjs().valueOf() - (reply as any).startTime}ms`,
        time: dayjs().format(FULL_VI_DATE_FORMAT),
      },
      'request completed.',
    );
    done();
  });

  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
    prefix: false,
  });

  await Promise.all([
    app.register(cors, {
      credentials: true,
      origin: configService.get('ALLOWED_ORIGINS').split(','),
    }),
    app.register(fastifyCookie),
    app.register(compression, { encodings: ['gzip', 'deflate'] }),
    app.register(helmet),
    app.register(fastifyCsrf),
    app.register(fastifyStatic, {
      root: join(__dirname, '..', 'public'),
      prefix: '/public/',
    }),
  ]);

  if (configService.get('SWAGGER_ENABLE') === true) {
    const config = new DocumentBuilder()
      .setTitle('NestJS Boilerplate - OpenAPI')
      .setDescription('NestJS Boilerplate - OpenAPI')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
  await app.listen(+configService.get('PORT'), '0.0.0.0');
}
bootstrap();
