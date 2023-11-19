import { Module } from '@nestjs/common';
import { BookingtiketsService } from './bookingtikets.service';
import { BookingtiketsController } from './bookingtikets.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BookingtiketsController],
  providers: [BookingtiketsService,PrismaService],
})
export class BookingtiketsModule {}
