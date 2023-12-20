import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookingtiketDto, CreateShowtimeDto, Ticket } from './dto/create-bookingtiket.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AppService } from 'src/app.service';
import * as moment from 'moment';
import 'moment/locale/vi'
import { User } from 'src/users/entities/user.entity';
import { Seat } from './entities/bookingtiket.entity';
moment.locale('vi')

@Injectable()
export class BookingtiketsService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }
  async createShowtime({ maPhim, giaVe, ngayChieuGioChieu, maRap }) {
    let data = {
      maPhim,
      ngayChieuGioChieu: moment(ngayChieuGioChieu).format(),
      giaVe,
      maRap
    }

    await this.prisma.lich_chieu.create({ data })
    return this.response(data, 201)

  }

  async getListBooking(id: number) {
    if (!id) throw new InternalServerErrorException('Mã lịch chiếu không tồn tại')
    const lichChieu = await this.prisma.lich_chieu.findFirst({
      where: {
        maLichChieu: id
      }
    })
    if (!lichChieu) throw new NotFoundException('Lịch chiếu không tồn tại')

    const { maRap, maLichChieu, maPhim, ngayChieuGioChieu, giaVe } = lichChieu
    const phim = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    const { hinhAnh, tenPhim } = phim
    const rapPhim = await this.prisma.rap_phim.findFirst({
      where: {
        maRap
      }
    })
    const { maCumRap, tenRap } = rapPhim
    const cumRap = await this.prisma.cum_rap.findFirst({
      where: {
        maCumRap
      }
    })
    const { tenCumRap, diaChi } = cumRap

    let ngayChieu = moment(ngayChieuGioChieu).format('MM/DD/YYYY')
    let gioChieu = moment(ngayChieuGioChieu).format('HH:mm')

    const ghe = await this.prisma.ghe.findMany({
      where: {
        maRap
      },
      include: {
        dat_ve: true
      }
    })
    const danhSachGhe = ghe.flatMap(item => {
      const gia = item.loaiGhe === 'Vip' ? 100000 : giaVe;
      let taiKhoanNguoiDat = null
      let daDat = false
      item.dat_ve.forEach(datVe => {
        if (datVe.maGhe === item.maGhe) {
          taiKhoanNguoiDat = datVe.taiKhoan
          daDat = true
        }
      })
      return {
        maGhe: item.maGhe,
        tenGhe: item.tenGhe,
        loaiGhe: item.loaiGhe,
        maRap: item.maRap,
        giaVe: gia,
        daDat,
        taiKhoanNguoiDat
      };
    });
    let data = {
      thongTinPhim: {
        maLichChieu,
        tenCumRap,
        tenRap,
        diaChi,
        tenPhim,
        hinhAnh,
        ngayChieu,
        gioChieu
      },
      danhSachGhe
    }
    return this.response(data)

  }

  async bookingTickets(token: User, body: CreateBookingtiketDto) {
    const { maLichChieu, danhSachVe } = body
    const status = await this.prisma.lich_chieu.findFirst({
      where: {
        maLichChieu
      }
    })
    if (!status) throw new InternalServerErrorException('Mã lịch chiếu không tồn tại')
    let arr = []
    const data = await this.prisma.dat_ve.findMany()
    danhSachVe.forEach(list => {
      let index = data.findIndex(item => item.maGhe === list.maGhe)
      if (index === -1) arr.push({ maGhe: list.maGhe, maLichChieu, taiKhoan: token.taiKhoan })

    })

    await this.prisma.dat_ve.createMany({
      data: arr,
      skipDuplicates: true
    })
    console.log(arr)
    return this.response('Đặt vé thành công', 201)

  }
  async choosingSeats(seat: Seat) {
    const { maGhe, tenGhe, maRap, taiKhoanNguoiDat, id } = seat
    let data = {
      maGhe,
      tenGhe,
      maRap,
      taiKhoanNguoiDat,
      id
    }

    return data
  }


}
