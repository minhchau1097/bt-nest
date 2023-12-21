import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LoginService extends AppService {
  constructor(private prisma: PrismaService, private jwtService: JwtService){
    super()
  }
  async logIn({ taiKhoan, matKhau }) {

    let status = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (!status) throw new BadRequestException('Tài khoản không đúng')
    if (bcrypt.compareSync(matKhau, status.matKhau)) {
      let data = {
        taiKhoan: status.taiKhoan,
        hoTen: status.hoTen,
        email: status.email,
        soDt: status.soDt,
        loaiNguoiDung: status.loaiNguoiDung
      }
      let token = await this.jwtService.signAsync({ data });
      return this.response(token, 201)
    } else {
      throw new BadRequestException('Mật khẩu không đúng')
    }
  }


}
