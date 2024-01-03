import { Controller, Get, Post, Body, Delete, Query, UseGuards, Request, Put, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiQuery, ApiBearerAuth, ApiTags, ApiBody, } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get('LayDanhSachNguoiDung')
  getUser(@Query('tuKhoa') tuKhoa: string) {
    try {
      return this.usersService.getUser(tuKhoa);
    } catch (err) { }
  }
  @Get('TimKiemNguoiDung')
  findUser(@Query('tuKhoa') tuKhoa: string) {
    try {
      return this.usersService.findUser(tuKhoa);
    } catch (err) { }
  }
  @Get('LayDanhSachNguoiDungPhanTrang')
  @ApiQuery({ name: 'tuKhoa', required: false })
  @ApiQuery({
    name: 'soTrang', required: false, schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'soPhanTuTrenTrang', required: false, schema: {
      default: 20
    }
  })
  getUserPage(@Query('tuKhoa') tuKhoa: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number
  ) {
    try {
      return this.usersService.getUserPage(tuKhoa, soTrang, soPhanTuTrenTrang);
    } catch (err) { }
  }

  @Get('TimKiemNguoiDungPhanTrang')
  @ApiQuery({ name: 'tuKhoa', required: false })
  @ApiQuery({
    name: 'soTrang', required: false, schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'soPhanTuTrenTrang', required: false, schema: {
      default: 20
    }
  })
  findUserPage(@Query('tuKhoa') tuKhoa: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number
  ) {
    try {
      return this.usersService.findUserPage(tuKhoa, soTrang, soPhanTuTrenTrang);
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('ThongTinTaiKhoan')
  inforUser(@Request() req) {
    try {
      let tokenDecode = req.user;
      return this.usersService.inforUser(tokenDecode.data)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('LayThongTinNguoiDung')
  @ApiQuery({ name: 'taiKhoan', required: false })
  getInforUser(@Request() req, @Query('taiKhoan') taiKhoan: string) {
    try {
      let tokenDecode = req.user;
      return this.usersService.getInforUser(tokenDecode.data, taiKhoan)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('ThemNguoiDung')
  @ApiBody({
    type: CreateUserDto
  })
  addUser(@Body() body: CreateUserDto) {
    try {
      return this.usersService.addUser(body)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('CapNhatThongTinNguoiDung')
  @ApiBody({
    type: UpdateUserDto
  })
  updateUserAd(@Body() body: UpdateUserDto) {
    try {
      return this.usersService.updateUserAd(body)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('CapNhatThongTinNguoiDung')
  @ApiBody({
    type: UpdateUserDto
  })
  updateUser(@Body() body: UpdateUserDto) {
    try {
      return this.usersService.updateUser(body)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('XoaNguoiDung')
  deleteUser(@Query('taiKhoan') taiKhoan: string) {
    try {
      return this.usersService.deleteUser(taiKhoan)
    } catch (err) { }
  }
}
