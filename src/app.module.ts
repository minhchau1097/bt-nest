import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { TheatersModule } from './theaters/theaters.module';
import { BookingtiketsModule } from './bookingtikets/bookingtikets.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),AuthModule, UsersModule, FilmsModule, TheatersModule, BookingtiketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
