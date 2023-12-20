import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [SignupController],
  providers: [SignupService,PrismaService],
})
export class SignupModule {}
