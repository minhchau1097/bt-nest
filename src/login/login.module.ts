import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({imports: [JwtModule.register({
  secret: process.env.SECRET_KEY,
  signOptions: { expiresIn: '1y' }
})],
  controllers: [LoginController],
  providers: [LoginService,JwtStrategy, PrismaService],
})
export class LoginModule {}
