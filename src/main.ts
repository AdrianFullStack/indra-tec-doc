import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(
    'TU_SECRETO_SUPER_SEGURO'
  ));

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  
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
  );

  app.useGlobalInterceptors(
    new ResponseInterceptor()
  );

  const config = new DocumentBuilder()
    .setTitle('Documentación APIs Indra Tec Doc')
    .setDescription('Documentación del proyecto Tec Doc.')
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'Cookie de sesión JWT'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
