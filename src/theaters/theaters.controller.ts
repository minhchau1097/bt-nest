import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { ApiOkResponse, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

 
  @Get('LayThongTinHeThongRap')
  @ApiQuery({
   name:'maHeThongRap', required:false
  })
  // @ApiOkResponse({
  //   status:200,description:'Xử lý thành công',type:[UserDto] ,content:{}
  // })
  getTheaterSystem(@Query('maHeThongRap') id:string) {
    return this.theatersService.getTheaterSystem(id);
  }
  @Get('LayThongTinCumRapTheoHeThong')
  // @ApiQuery({
  //  name:'maHeThongRap', required:true
  // })
  // @ApiOkResponse({
  //   status:200,description:'Xử lý thành công',type:[UserDto] ,content:{}
  // })
  getTheaterCluster(@Query('maHeThongRap') id:string) {
    return this.theatersService.getTheaterCluster(id);
  }
  @ApiQuery({name:'maHeThongRap',required:false})
  @Get('LayThongTinLichChieuHeThongRap')
  getTheaterShowtimes(@Query('maHeThongRap') id:string) {
    return this.theatersService.getTheaterShowtimes(id);
  }
  @ApiQuery({name:'maPhim',required:false})
  @Get('LayThongTinLichChieuPhim')
  getTheaterShowtimeInfor(@Query('maPhim') id:number) {
    return this.theatersService.getTheaterShowtimeInfor(+id);
  }
 
   
}
