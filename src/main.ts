import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const port = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`My Portfolio API is running at port ${port}`);
}
main();
