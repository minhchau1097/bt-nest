import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AppService } from 'src/app.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }


  async getUser(tuKhoa: string = '') {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        taiKhoan: {
          contains: tuKhoa
        }
      }
    })
    return this.response(data);
  }
  async findUser(tuKhoa: string = '') {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        taiKhoan: {
          contains: tuKhoa
        }
      }
    })
    return this.response(data);
  }
  async getUserPage(tuKhoa: string = '', soTrang: number = 1, soPhanTuTrenTrang: number = 20) {
    let index = Number((soTrang - 1)) * Number(soPhanTuTrenTrang);
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        taiKhoan: {
          contains: tuKhoa
        }
      },
      skip: index,
      take: Number(soPhanTuTrenTrang)
    })
    return this.response(data);
  }
  async findUserPage(tuKhoa: string = '', soTrang: number = 1, soPhanTuTrenTrang: number = 20) {
    if (soTrang <= 0) throw new BadRequestException('Số trang không hợp lệ')
    if (soPhanTuTrenTrang <= 0) throw new BadRequestException('Số phần tử trên trang không hợp lệ')
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
    return this.response(data);
  }
  async inforUser(user: User) {
    let data = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan: user.taiKhoan
      }
    })
    if(!data) throw new BadRequestException('Tài khoản không tồn tại')
    const { taiKhoan, matKhau,email,hoTen,soDt,loaiNguoiDung } = data;
    const [account, phim] = await Promise.all([
      this.prisma.dat_ve.findMany({
        where: {
          taiKhoan
        },
        include: {
          ghe: {
            include: {
              rap_phim: {
                include: {
                  cum_rap: {
                    include: {
                      he_thong_rap: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      this.prisma.dat_ve.findMany({
        where: {
          taiKhoan
        },
        include: {
          lich_chieu: {
            include: {
              phim: true
            }
          }
        }
      })
    ])
    const thongTinDatVe = []
    for (const key of phim) {
      const danhSachGhe = []
      const lichChieu = key.lich_chieu;
      const phim = lichChieu.phim;
      if (key.lich_chieu.maPhim === phim.maPhim) {
        for (const item of account) {
          const index = danhSachGhe.findIndex(filter => filter.maGhe === item.maGhe)

          const ghe = item.ghe;
          const rapPhim = ghe.rap_phim;
          const cumRap = rapPhim.cum_rap;
          const heThong = cumRap.he_thong_rap
          if (item.maVe === key.maVe) {
            danhSachGhe.push({
              maHeThongRap: heThong.maHeThongRap,
              tenHeThongRap: heThong.tenHeThongRap,
              maCumRap: cumRap.maCumRap,
              tenCumRap: cumRap.tenCumRap,
              maRap: rapPhim.maRap,
              tenRap: rapPhim.tenRap,
              maGhe: ghe.maGhe,
              tenGhe: ghe.tenGhe,
            })
          }
        }
        thongTinDatVe.push({
          danhSachGhe,
          giaVe: lichChieu.giaVe,
          hinhAnh: phim.hinhAnh,
          maVe: key.maVe,
          tenPhim: phim.tenPhim,

        })

      }

    }
    let newData = {
      hoTen,
      taiKhoan,
      email,
      soDt,
      loaiNguoiDung,
      thongTinDatVe
    }
    return this.response(newData, 201)
  }
  async getInforUser(user: User, value: string) {
    let taiKhoan = this.trimValue(value)
    const data = await this.prisma.nguoi_dung.findMany({
      where: {
        taiKhoan: {
          contains: taiKhoan
        }
      }
    })
    if (data.length <= 0) throw new NotFoundException('Tài khoản không tồn tại')
    const newData = data?.map((item) => {
      const { matKhau, ...newItem } = item
      return newItem
    })
    return this.response(newData, 201);
  }
  async addUser(user: User) {
    const { taiKhoan, loaiNguoiDung } = user;
    const status = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (!status) {
      const type = loaiNguoiDung.toLowerCase()
      if (type === 'admin' || type === 'customer') {
        let passBcrypt = bcrypt.hashSync(user.matKhau, 10)
        let data = { ...user, matKhau: passBcrypt, loaiNguoiDung: type.toUpperCase() }
        await this.prisma.nguoi_dung.create({ data })
        return this.response('Thêm mới thành công', 201)
      }
      throw new BadRequestException('Loại người dùng không hợp lệ')
    }
    throw new BadRequestException('Tài khoản đã tồn tại')
  }
  async updateUserAd(user: UpdateUserDto) {
    const { taiKhoan, loaiNguoiDung } = user;

    const status = await this.prisma.nguoi_dung.findFirst({
      where: {

        taiKhoan

      }
    })
    if (status) {
      const type = loaiNguoiDung.toLowerCase()
      if (type === 'admin' || type === 'customer') {

        let passBcrypt = bcrypt.hashSync(user.matKhau, 10)
        let data = { ...user, matKhau: passBcrypt, loaiNguoiDung: type.toUpperCase() }
        await this.prisma.nguoi_dung.update({
          where: {
            taiKhoan: status.taiKhoan
          },
          data
        })
        return this.response('Cập nhật thành công', 201)
      }
      throw new BadRequestException('Loại người dùng không hợp lệ')
    }
    throw new NotFoundException('Tài khoản không tồn tại')
  }
  async updateUser(user: UpdateUserDto) {
    const { taiKhoan, matKhau, loaiNguoiDung } = user;
    const type = loaiNguoiDung.toLowerCase()
    if (type === 'admin' || type === 'customer') {
      const status = await this.prisma.nguoi_dung.findFirst({
        where: {

          taiKhoan

        }
      })
      if (status) {
        let passBcrypt = bcrypt.hashSync(matKhau, 10)
        let data = { ...user, matKhau: passBcrypt, loaiNguoiDung: type.toUpperCase() }
        await this.prisma.nguoi_dung.update({
          where: {
            taiKhoan: status.taiKhoan
          },
          data
        })
        return this.response('Cập nhật thành công', 201)
      } else {

        throw new NotFoundException('Tài khoản không tồn tại')
      }
    }
    throw new BadRequestException('Loại người dùng không hợp lệ')
  }
  async deleteUser(value: string) {
    let taiKhoan = this.trimValue(value);
    let user = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (user) {
      await this.prisma.nguoi_dung.delete({
        where: {
          taiKhoan: user.taiKhoan
        }
      })
      return this.response('Xoá thành công')


    } else {
      throw new NotFoundException('Tài khoản không tồn tại')
    }
  }

}
