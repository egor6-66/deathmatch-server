import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Interceptors } from '@utils';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import process from 'process';

import AppModule from './app.module';

const options = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: options,
    });

    app.use(cors(options));
    app.useGlobalInterceptors(new Interceptors.TransformResponse());
    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: false,
        })
    );

    await app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    });
}

bootstrap();
