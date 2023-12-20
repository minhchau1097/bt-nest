import { Controller, Post, Body } from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateSignupDto } from './dto/create-signup.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class SignupController {
  constructor(private readonly signupService: SignupService) { }
  @Post('DangKy')
  @ApiBody({
    type: CreateSignupDto
  })
  signUp(@Body() body: CreateSignupDto) {
    try {
      return this.signupService.signUp(body);
    } catch (err) { }
  }

}
