import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({ imports: [MulterModule.register({
  storage: memoryStorage()
})],
  controllers: [FilmsController],
  providers: [FilmsService,PrismaService],
})
export class FilmsModule {}
