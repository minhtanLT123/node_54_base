import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 3069;
  await app.listen(PORT, () => {
    console.log(`Start Backend Successfully at http://localhost:${PORT}`);
  });
}
bootstrap();
