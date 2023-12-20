import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUser } from './entities/login.entity';
@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @Post('DangNhap')
  @ApiBody({
    type: LoginUser
  })
  logIn(@Body() body: LoginUser) {
    try {
      return this.loginService.logIn(body);
    } catch (err) { }
  }


}
