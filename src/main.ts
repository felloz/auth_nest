import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //White list filtra los campos del request y solo recibe el controlador los datos que
    //se hayan declarado en el dto
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(3000);
}
bootstrap();
