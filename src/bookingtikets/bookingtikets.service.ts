import { lich_chieu } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateBookingtiketDto, CreateShowtime } from './dto/create-bookingtiket.dto';
import { UpdateBookingtiketDto } from './dto/update-bookingtiket.dto';
import { PrismaService } from 'src/prisma.service';
import { AppService } from 'src/app.service';

@Injectable()
export class BookingtiketsService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }
  async createShowtime({ maPhim, giaVe, ngayChieuGioChieu, maRap }) {
    let date = this.parseDate(new Date(ngayChieuGioChieu).getTime())
    let data = {
      maPhim,
      ngayChieuGioChieu: date,
      giaVe,
      maRap
    }

    await this.prisma.lich_chieu.create({ data })
    return data;
  }

  getListBooking() {
    return `This action returns all bookingtikets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingtiket`;
  }

  update(id: number, updateBookingtiketDto: UpdateBookingtiketDto) {
    return `This action updates a #${id} bookingtiket`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingtiket`;
  }
}
