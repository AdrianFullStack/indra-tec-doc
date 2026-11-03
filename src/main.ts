import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AppModule, ObserveInstrument } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app = await NestFactory.create(AppModule, {
  //   instrument: ObserveInstrument,
  // });
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    })
  );

  app.useGlobalFilters(
    new HttpExceptionFilter()
  )

  app.useGlobalInterceptors(
    new ResponseInterceptor()
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
