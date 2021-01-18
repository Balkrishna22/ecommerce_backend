import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.enableCors();
    app.use('/uploads', express.static('uploads'));
    app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
    await app.listen(8000);
}
bootstrap();
