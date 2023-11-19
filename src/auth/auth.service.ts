import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  async signUp({taiKhoan, email, matKhau, soDt, hoTen }) {
    if(!taiKhoan) return 'Tài khoản không được rỗng'
    if(!email) return 'Email không được rỗng'
    if(!matKhau) return 'Tài khoản không được rỗng'
    if(!soDt) return 'Mật khẩu không được rỗng'
    if(!hoTen) return 'Họ tên không được rỗng'
    let status = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (status) return 'Email đã tồn tại'
    let passCrypt = bcrypt.hashSync(matKhau, 10);
    let data = {
      ...status,taiKhoan, email, matKhau: passCrypt, soDt, hoTen
    }
    await this.prisma.nguoi_dung.create({ data })

    return data;
  } 
  async logIn({ taiKhoan, matKhau }) {

    let status = await this.prisma.nguoi_dung.findFirst({
      where: { 
        taiKhoan
      }
    })
    if (!status) return 'Email không đúng'
    if (bcrypt.compareSync(matKhau, status.matKhau)) {
      let data = {
        taiKhoan: status.taiKhoan,
        hoTen: status.hoTen,
        email: status.email,
        soDt: status.soDt,
        loaiNguoiDung: status.loaiNguoiDung
      }
      let token = await this.jwtService.signAsync({ data });
      return token
    } else {
      return 'Mật khẩu không đúng'
    }
  }

}
