import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './shared/config';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field ko được khai báo decorator trong DTO
      forbidNonWhitelisted: true, // Ném ra lỗi nếu có field ko được khai báo decorator trong DTO
      transform: true, // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      transformOptions: {
        enableImplicitConversion: true, // Cho phép tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            errorMessage: Object.values(error.constraints! || {}).join(', '),
          })),
        );
      },
    }),
  );
  await app.listen(envConfig.PORT);
}
bootstrap();
