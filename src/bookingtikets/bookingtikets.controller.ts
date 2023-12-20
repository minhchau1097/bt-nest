
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { BookingtiketsService } from './bookingtikets.service';
import { CreateBookingtiketDto, CreateShowtimeDto, Ticket } from './dto/create-bookingtiket.dto';
import { UpdateBookingtiketDto } from './dto/update-bookingtiket.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('QuanLyDatVe')
@Controller('api/QuanLyDatVe')
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BookingtiketsController {
  constructor(private readonly bookingtiketsService: BookingtiketsService) { }
  @ApiBody({
    type: CreateShowtimeDto,
  })
  @Post('TaoLichChieu')
  createShowtime(@Body() body: CreateShowtimeDto) {
    try {
      return this.bookingtiketsService.createShowtime(body);

    } catch (err) { }
  }
  @Get('LayDanhSachPhongVe')
  @ApiQuery({
    name: 'maLichChieu',
    required: false
  })
  getListBooking(@Query('maLichChieu') maLichChieu: number) {
    try {
      return this.bookingtiketsService.getListBooking(+maLichChieu);
    } catch (err) { }
  }
  @ApiBody({
    type: CreateBookingtiketDto
  })
  @Post('DatVe')
  bookingTickets(@Request() req, @Body() body: CreateBookingtiketDto) {
    try {
      let tokenDecode = req.user;
      return this.bookingtiketsService.bookingTickets(tokenDecode.data, body);
    } catch (err) { }
  }

}
