import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppService } from 'src/app.service';
import * as sharp from 'sharp';
import * as path from 'path';
import { UpdateFilmDto } from './dto/update-film.dto';
import * as moment from 'moment';
import 'moment/locale/vi'
import { Film } from './entities/film.entity';
import * as fs from 'fs'

moment.locale('vi')
@Injectable()
export class FilmsService extends AppService {
  constructor(protected prisma: PrismaService) {
    super()
  }
  async getBanner() {

    const data = await this.prisma.banner_phim.findMany();
    return this.response(data)

  }

  async getFilms(value: string = '') {
    const data = await this.prisma.phim.findMany({
      where: {
        tenPhim: {
          contains: value
        }
      }
    })
    const newData = data.map(item => {
      return { ...item, ngayKhoiChieu: moment(item.ngayKhoiChieu).format() }
    })
    return this.response(newData)

  }
  async addFilms(file: Express.Multer.File, body: Film) {
    let { tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, danhGia, hot, sapChieu } = body
    danhGia = Number(danhGia);
    let _hot = this.parseBoolean(`${hot}`)
    let _dangChieu = this.parseBoolean(`${dangChieu}`)
    let _sapChieu = this.parseBoolean(`${sapChieu}`)
    let status = await this.prisma.phim.findFirst({
      where: {
        tenPhim
      }
    })
    if (status) throw new InternalServerErrorException('Phim đã tồn tại')
    const filename = Date.now() + '_' + file.originalname + '.webp';
    await sharp(file.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(path.join(process.cwd() + '/public/img', filename));
    let data = {
      tenPhim,
      trailer,
      hinhAnh: filename,
      moTa,
      ngayKhoiChieu: moment(ngayKhoiChieu).format(),
      danhGia,
      hot: _hot,
      dangChieu: _dangChieu,
      sapChieu: _sapChieu,
    }
    const phim = await this.prisma.phim.create({ data })
    await this.prisma.banner_phim.create({
      data: {
        maPhim: phim.maPhim,
        hinhAnh: phim.hinhAnh
      }
    })
    return this.response(data, 201)

  }
  async updateFilms(file: Express.Multer.File, body: UpdateFilmDto) {
    let {maPhim, tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, danhGia, hot, sapChieu } = body
    maPhim = Number(maPhim)
    danhGia = Number(danhGia);
    let _hot = this.parseBoolean(`${hot}`)
    let _dangChieu = this.parseBoolean(`${dangChieu}`)
    let _sapChieu = this.parseBoolean(`${sapChieu}`)
    let fileName = '';

    let status = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    if (!status) throw new NotFoundException('Phim không tồn tại')

    if (file) {
      fs.unlinkSync(path.join(process.cwd() + '/public/img', status.hinhAnh))

      fileName = Date.now() + '_' + file.originalname + '.webp';

      await sharp(file.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toFile(path.join(process.cwd() + '/public/img', fileName));
    }
    let data = {
      tenPhim,
      trailer,
      hinhAnh: file ? fileName : status.hinhAnh,
      moTa,
      ngayKhoiChieu: moment(ngayKhoiChieu).format(),
      danhGia,
      hot: _hot,
      dangChieu: _dangChieu,
      sapChieu: _sapChieu,
    }
    const phim = await this.prisma.phim.update({
      where: {
        maPhim: status.maPhim
      }, data
    })
    const banner = await this.prisma.banner_phim.findFirst({
      where: {
        maPhim: phim.maPhim
      }
    })
    await this.prisma.banner_phim.update({
      where: {
        maBanner: banner.maBanner,
        maPhim: phim.maPhim
      }, data: {
        hinhAnh: phim.hinhAnh
      }
    })
    return this.response(data, 201)

  }
  async getFilmsPage(tenPhim: string, soTrang: number = 1, soPhanTuTrenTrang: number = 10) {
    if (soTrang <= 0) throw new BadRequestException('Số trang không hợp lệ')
    if (soPhanTuTrenTrang <= 0) throw new BadRequestException('Số phần tử trên trang không hợp lệ')
    let index = Number((soTrang - 1)) * Number(soPhanTuTrenTrang);
    let data = await this.prisma.phim.findMany({
      where: {
        tenPhim: {
          contains: tenPhim
        }
      },
      skip: index,
      take: Number(soPhanTuTrenTrang)
    })
    return this.response(data);
  }
  async deleteFilms(maPhim: number) {
    maPhim = Number(maPhim);
    let data = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    if (!data) throw new BadRequestException('Phim không tồn tại')
    await this.prisma.phim.delete({
      where: {
        maPhim: data.maPhim
      }
    })
    return this.response('Xoá thành công')
  }
  async getInforFilm(maPhim: number) {
    maPhim = Number(maPhim);
    let data = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    let err = {
      message: 'Phim không tồn tại',
      statusCode: '400',
      content: 'Mã phim không hợp lệ!'
    }
    if (!data) throw new BadRequestException(err)
    return this.response({ ...data, ngayKhoiChieu: moment(data.ngayKhoiChieu).format() })
  }
  async getFilmsByDay(tenPhim: string, soTrang: number = 1, soPhanTuTrenTrang: number = 10, tuNgay: string, denNgay: string) {
    if (tuNgay && !moment(tuNgay, 'DD-MM-YYYY', true).isValid()) throw new BadRequestException('Ngày không hợp lệ')
    if (denNgay && !moment(denNgay, 'DD-MM-YYYY', true).isValid()) throw new BadRequestException('Ngày không hợp lệ')
    let index = Number((soTrang - 1)) * Number(soPhanTuTrenTrang);
    const phim = await this.prisma.phim.findMany({
      where: {
        tenPhim: {
          contains: tenPhim
        },
        ngayKhoiChieu: {
          gte: tuNgay ? moment(tuNgay, 'DD-MM-YYYY').startOf('day').toDate() : moment("20111031", "YYYYMMDD").toDate(),
          lte: denNgay ? moment(denNgay, 'DD-MM-YYYY').endOf('day').toDate() : moment().format()
        }

      },
      skip: index,
      take: Number(soPhanTuTrenTrang),

    })
    const newData = phim.map(item => {
      return { ...item, ngayKhoiChieu: moment(item.ngayKhoiChieu).format() }
    })
    return this.response(newData)
  }
}
