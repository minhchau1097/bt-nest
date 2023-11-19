import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Film } from './dto/create-film.dto';
import { PrismaService } from 'src/prisma.service';
import { AppService } from 'src/app.service';
import * as sharp from 'sharp';
import * as path from 'path';
import { UpdateFilmDto } from './dto/update-film.dto';
import { TheatersService } from 'src/theaters/theaters.service';
@Injectable()
export class FilmsService extends AppService {
  constructor(protected prisma: PrismaService) {
    super()
  }
  async getBanner() {
    let data = await this.prisma.banner_phim.findMany();
    return {
      message:'Xử lý thành công!',
      statusCode:'200',
      content: data
    };
  }

  async getFilms(value: string = '') {

    let data = await this.prisma.phim.findMany({
      where: {
        tenPhim: {
          contains:value
        }
      }
    })
    return {
      message:'Xử lý thành công!',
      statusCode:'200',
      content: data
    };
  }
  async addFilms(file: Express.Multer.File, body: Film) {
    console.log(body)
    let { tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, danhGia, hot, sapChieu } = body

    let date = this.parseDate(new Date(ngayKhoiChieu).getTime())
    danhGia = Number(danhGia);
    let _hot = this.parseBoolean(`${hot}`)
    let _dangChieu = this.parseBoolean(`${dangChieu}`)
    let _sapChieu = this.parseBoolean(`${sapChieu}`)


    let status = await this.prisma.phim.findFirst({
      where: {
        tenPhim
      }
    })
    if (status) return 'Phim đã tồn tại'
    console.log(date)
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
      ngayKhoiChieu: date,
      danhGia,
      hot: _hot,
      dangChieu: _dangChieu,
      sapChieu: _sapChieu,
    }
    await this.prisma.phim.create({ data })
    return {
      message:'Xử lý thành công!',
      statusCode:'200',
      content: data
    };
  }
  async updateFilms(file: Express.Multer.File, body: UpdateFilmDto) {
    let { tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, danhGia, hot, sapChieu } = body

    let date = this.parseDate(new Date(ngayKhoiChieu).getTime())
    danhGia = Number(danhGia);
    let _hot = this.parseBoolean(`${hot}`)
    let _dangChieu = this.parseBoolean(`${dangChieu}`)
    let _sapChieu = this.parseBoolean(`${sapChieu}`)
    let fileName = '';

    let status = await this.prisma.phim.findFirst({
      where: {
        tenPhim
      }
    })
    if (!status) throw new BadRequestException('Phim không tồn tại')

    if (file) {
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
      ngayKhoiChieu: date,
      danhGia,
      hot: _hot,
      dangChieu: _dangChieu,
      sapChieu: _sapChieu,
    }
    await this.prisma.phim.update({
      where: {
        maPhim: status.maPhim
      }, data
    })
    return {
      message:'Xử lý thành công!',
      statusCode:'200',
      content: data
    };
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
    return {
      message:'Xoá thành công!',
      statusCode:'200',
      content: data
    }
  }
  async getInforFilm(maPhim: number) {
    maPhim = Number(maPhim);
    let data = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    let err = {
      message:'Phim không tồn tại',
      statusCode:'400',
      content:'Mã phim không hợp lệ!'
    }
    if (!data) throw new BadRequestException(err)
    return {
      message:'Xử lý thành công!',
      statusCode:'200',
      content: data
    }
  }
}
