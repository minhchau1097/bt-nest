import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, Headers, Request, HttpCode, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiPropertyOptional, ApiBearerAuth, ApiTags, ApiBody, } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



  @Get('LayDanhSachNguoiDung')
  getUser(@Query('tuKhoa') tuKhoa: string) {
    return this.usersService.getUser(tuKhoa);
  }
  @Get('TimKiemNguoiDung')
  findUser(@Query('tuKhoa') tuKhoa: string) {
    return this.usersService.findUser(tuKhoa);
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
    return this.usersService.getUserPage(tuKhoa, soTrang, soPhanTuTrenTrang);
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
    return this.usersService.findUserPage(tuKhoa, soTrang, soPhanTuTrenTrang);
  }
  @Post('ThongTinTaiKhoan')
  inforUser(@Request() req) {
    let tokenDecode = req.user;
    return this.usersService.inforUser(tokenDecode.data)
  }
  @Post('LayThongTinNguoiDung')
  @ApiQuery({ name: 'taiKhoan', required: false })
  getInforUser(@Request() req, @Query('taiKhoan') taiKhoan: string) {
    let tokenDecode = req.user;
    return this.usersService.getInforUser(tokenDecode.data, taiKhoan)
  }
  @ApiBody({
    schema: {
      example: {
        taiKhoan: 'string',
        hoTen: 'string',
        email: 'string',
        soDt: 'string',
        matKhau: 'string',
        loaiNguoiDung: 'string'
      }
    }
  })
  @Post('ThemNguoiDung')
  addUser(@Body() body: User) {
    return this.usersService.addUser(body)
  }
  @ApiBody({
    schema: {
      example: {
        taiKhoan: 'string',
        hoTen: 'string',
        email: 'string',
        soDt: 'string',
        matKhau: 'string',
        loaiNguoiDung: 'string'
      }
    }
  })
  @Put('CapNhatThongTinNguoiDung')
  updateUserAd(@Body() body: User) {
    return this.usersService.updateUserAd(body)
  }
  @ApiBody({
    schema: {
      example: {
        taiKhoan: 'string',
        hoTen: 'string',
        email: 'string',
        soDt: 'string',
        matKhau: 'string',
        loaiNguoiDung: 'string'
      }
    }
  })
  @Post('CapNhatThongTinNguoiDung')
  updateUser(@Body() body: User) {
    return this.usersService.updateUser(body)
  }
  @Delete('XoaNguoiDung')
  deleteUser(@Query('taiKhoan') taiKhoan:string){
    return this.usersService.deleteUser(taiKhoan)
  }
}
