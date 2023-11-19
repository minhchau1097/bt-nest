import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: '1y' }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule { }
