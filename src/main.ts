import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: false });

    app.useGlobalPipes(new ValidationPipe(
        { skipMissingProperties: true }))
    await app.listen(8000);
}
bootstrap();
