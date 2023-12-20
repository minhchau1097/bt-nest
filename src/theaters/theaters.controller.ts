import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { ApiBearerAuth, ApiOkResponse, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
@UseFilters(HttpExceptionFilter)
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) { }


  @Get('LayThongTinHeThongRap')
  @ApiQuery({
    name: 'maHeThongRap', required: false
  })
  getTheaterSystem(@Query('maHeThongRap') id: string) {
    try {
      return this.theatersService.getTheaterSystem(id);
    } catch (err) { }
  }
  @Get('LayThongTinCumRapTheoHeThong')
  getTheaterCluster(@Query('maHeThongRap') id: string) {
    try {
      return this.theatersService.getTheaterCluster(id);
    } catch (err) { }
  }
  @ApiQuery({ name: 'maHeThongRap', required: false })
  @Get('LayThongTinLichChieuHeThongRap')
  getTheaterShowtimes(@Query('maHeThongRap') id: string) {
    try {
      return this.theatersService.getTheaterShowtimes(id);
    } catch (err) { }
  }
  @ApiQuery({ name: 'maPhim', required: false })
  @Get('LayThongTinLichChieuPhim')
  getTheaterShowtimeInfor(@Query('maPhim') id: number) {
    try {
      return this.theatersService.getTheaterShowtimeInfor(+id);
    } catch (err) { }
  }


}
