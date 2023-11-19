import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import * as dotenv from 'dotenv';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.static("."))
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
  .setTitle('Movie').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger',app , document)
  await app.listen(8080);
}
bootstrap();
 