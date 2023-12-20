import { Module } from '@nestjs/common';
import { BookingtiketsService } from './bookingtikets.service';
import { BookingtiketsController } from './bookingtikets.controller';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateWay } from './bookingtickets.gateway';

@Module({
  controllers: [BookingtiketsController],
  providers: [BookingtiketsService,PrismaService,MyGateWay],
})
export class BookingtiketsModule {}
