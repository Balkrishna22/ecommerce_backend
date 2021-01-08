import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: false });
    app.use('/uploads', express.static('uploads'));
    app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
    await app.listen(8000);
}
bootstrap();
