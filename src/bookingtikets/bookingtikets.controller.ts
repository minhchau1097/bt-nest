import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingtiketsService } from './bookingtikets.service';
import { CreateBookingtiketDto, CreateShowtime } from './dto/create-bookingtiket.dto';
import { UpdateBookingtiketDto } from './dto/update-bookingtiket.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { lich_chieu } from '@prisma/client';
@ApiTags('QuanLyDatVe')
@Controller('api/QuanLyDatVe')
export class BookingtiketsController {
  constructor(private readonly bookingtiketsService: BookingtiketsService) {}
@ApiBody({
  
  type: CreateShowtime,
  
})
  @Post('TaoLichChieu')
  createShowtime(@Body() body:CreateShowtime) {
    return this.bookingtiketsService.createShowtime(body);
  }

  @Get('LayDanhSachPhongVe')
  getListBooking() {
    return this.bookingtiketsService.getListBooking();
  } 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingtiketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingtiketDto: UpdateBookingtiketDto) {
    return this.bookingtiketsService.update(+id, updateBookingtiketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingtiketsService.remove(+id);
  }
}
