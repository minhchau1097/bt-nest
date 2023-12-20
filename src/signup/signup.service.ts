import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppService } from 'src/app.service';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class SignupService extends AppService{
  constructor(private prisma: PrismaService){
    super()
  }
  async signUp({ taiKhoan, email, matKhau, soDt, hoTen }) {

    let status = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (status) throw new BadRequestException('Tài khoản đã tồn tại')
    let passCrypt = bcrypt.hashSync(matKhau, 10);
    let data = {
      ...status, taiKhoan, email, matKhau: passCrypt, soDt, hoTen
    }
    await this.prisma.nguoi_dung.create({ data })

    return this.response(data, 201);
  }
  
}
