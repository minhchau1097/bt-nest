import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { TheatersModule } from './theaters/theaters.module';
import { BookingtiketsModule } from './bookingtikets/bookingtikets.module';

import { CommentsModule } from './comments/comments.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }), UsersModule, FilmsModule, TheatersModule, BookingtiketsModule, CommentsModule, LoginModule, SignupModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],
})
export class AppModule {}
