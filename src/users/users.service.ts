import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AppService } from 'src/app.service';


@Injectable()
export class UsersService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }


  async getUser(tuKhoa: string = '') {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        email: {
          contains: tuKhoa
        }
      }
    })
    return data;
  }
  async findUser(tuKhoa: string = '') {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        email: {
          contains: tuKhoa
        }
      }
    })
    return data;
  }
  async getUserPage(tuKhoa: string = '', soTrang: number = 1, soPhanTuTrenTrang: number = 20) {
    let index = Number((soTrang - 1)) * Number(soPhanTuTrenTrang);
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        email: {
          contains: tuKhoa
        }
      },
      skip: index,
      take: Number(soPhanTuTrenTrang)
    })
    return data;
  }
  async findUserPage(tuKhoa: string = '', soTrang: number = 1, soPhanTuTrenTrang: number = 20) {
    if (soTrang <= 0) throw new HttpException('lỗi', 404)
    if (soPhanTuTrenTrang <= 0) return 'Số phần tử trên trang không hợp lệ'
    let index = Number((soTrang - 1)) * Number(soPhanTuTrenTrang);
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        email: {
          contains: tuKhoa
        }
      },
      skip: index,
      take: Number(soPhanTuTrenTrang)
    })
    return data;
  }
  async inforUser(user: User) {
    let data = await this.prisma.nguoi_dung.findFirst({
      where: {
        id: user.id,
        taiKhoan: user.taiKhoan
      }
    })
    const { matKhau, ...updateData } = data;

    return updateData
  }
  async getInforUser(user: User, value: string) {
    try {
      let taiKhoan = this.trimValue(value)
      const data = await this.prisma.nguoi_dung.findMany({
        where: {
          taiKhoan: {
            contains: taiKhoan
          }
        }
      })
      if (data.length <= 0) throw new HttpException('Tài khoản không hợp lệ', 404)
      const newData = data?.map((item) => {
        const { matKhau, ...newItem } = item
        return newItem
      })
      return newData
    } catch (err) {
      return err.message
    }
  }
  async addUser(user: User) {
    const status = await this.prisma.nguoi_dung.findFirst({
      where: {
        AND: [
          { id: user.id },
          { taiKhoan: user.taiKhoan }
        ]
      }
    })
    if (!status) {
      let passBcrypt = bcrypt.hashSync(user.matKhau, 10)
      let data = { ...user, matKhau: passBcrypt }
      await this.prisma.nguoi_dung.create({ data })
      return 'Thêm mới thành công'

    }
    return 'Tài khoản đã tồn tại'
  }
  async updateUserAd(user: User) {
    const status = await this.prisma.nguoi_dung.findFirst({
      where: {
        AND: [
          { id: user.id },
          { taiKhoan: user.taiKhoan }
        ]
      }
    })
    if (status) {
      let passBcrypt = bcrypt.hashSync(user.matKhau, 10)
      let data = { ...user, matKhau: passBcrypt }
      await this.prisma.nguoi_dung.update({
        where: {
          id: status.id
        },
        data
      })
      return 'Cập nhật thành công'
    }
    return 'Tài khoản không tồn tại'
  }
  async updateUser(user: User) {
    let data = this.trimObjectValues(user);
    const { id, taiKhoan, hoTen, email, soDt, matKhau, loaiNguoiDung } = data;
    if (!taiKhoan) return 'Tài khoản không tồn tại'
    if (!hoTen) return 'Họ tên không được rỗng'
    if (!email) return 'Email không được rỗng'
    if (!soDt) return 'Số điện thoại không được rỗng'
    if (!matKhau) return 'Mật khẩu không được rỗng'
    if (!loaiNguoiDung) return 'Loại người dùng không được rỗng'
    if (loaiNguoiDung !== 'ADMIN' && loaiNguoiDung !== 'CUSTOMER') {
      return 'Loại người dùng chỉ có 2 giá trị ADMIN và CUSTOMER'

    }
    const status = await this.prisma.nguoi_dung.findFirst({
      where: {
        AND: [
          { id },
          { taiKhoan }
        ]
      }
    })
    if (status) {
      let passBcrypt = bcrypt.hashSync(matKhau, 10)
      let data = { ...user, matKhau: passBcrypt }
      await this.prisma.nguoi_dung.update({
        where: {
          id: status.id
        },
        data
      })
      return 'Cập nhật thành công'
    }
    return 'Tài khoản không tồn tại'
  }
  async deleteUser(value: string) {
    let taiKhoan = this.trimValue(value);
    console.log('tai khoan' + taiKhoan)
    let user = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (user) {
      let status = await this.prisma.nguoi_dung.delete({
        where: {
          id: user.id
        }
      })
      return 'Xoá thành công'


    } else {
      return 'Tài khoản không tồn tại'
    }
  }
}
