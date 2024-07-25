import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Interceptors, Pipes } from '@utils';
import cookieParser from 'cookie-parser';
import process from 'process';

import AppModule from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new Interceptors.TransformResponse());
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: false,
        })
        // new Pipes.Validation()
    );
    await app.listen(process.env.PORT || 5000);
}

bootstrap();
