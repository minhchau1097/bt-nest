import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser, User } from './entities/auth.entity';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/DangKy')
  @ApiBody({schema: {
    example:{
      taiKhoan: 'string',
      hoTen: 'string',
      email: 'string',
      soDt: 'string',
      matKhau: 'string'
    }
  }})
  signUp(@Body() body:User) {
    return this.authService.signUp(body);
  }
  
  @Post('/DangNhap')
  @ApiBody({
    schema:{
      example:{
        taiKhoan: 'string',
        matKhau: 'string'
      }
    }
  })
  logIn(@Body() body:LoginUser) {
    
    return this.authService.logIn(body);
  }
}
