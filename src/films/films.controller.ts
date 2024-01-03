import { Controller, Get, Post, Body, Delete, Query, UseInterceptors, UploadedFile, UseFilters, UseGuards } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFilmDto } from './dto/update-film.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { Film } from './entities/film.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('QuanLyPhim')
@Controller('api/QuanLyPhim')
@UseFilters(HttpExceptionFilter)

export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {
  }

  @Get('LayDanhSachBanner')
  getBanner() {
    try {
      return this.filmsService.getBanner();
    } catch (err) { }
  }

  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'tenPhim', required: false })
  getFilms(@Query('tenPhim') tenPhim: string) {
    try {
      return this.filmsService.getFilms(tenPhim);
    } catch (err) { }
  }
  @Get('LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({
    name: 'soTrang', required: false, schema: {
      default: 1
    },
  })
  @ApiQuery({
    name: 'soPhanTuTrenTrang', required: false, schema: {
      default: 10
    }
  })
  getFilmsPage(@Query('tenPhim') tenPhim: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number
  ) {
    try {
      return this.filmsService.getFilmsPage(tenPhim, soTrang, soPhanTuTrenTrang)
    } catch (error) {

    }
  }
  @Get('LayDanhSachPhimTheoNgay')
  @ApiQuery({
    name: 'tenPhim', required: false
  })
  @ApiQuery({
    name: 'soTrang', required: false, schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'soPhanTuTrenTrang', required: false, schema: {
      default: 10
    }
  })
  @ApiQuery({
    name: 'tuNgay', required: false
  })
  @ApiQuery({
    name: 'denNgay', required: false
  })
  getFilmsByDay(
    @Query('tenPhim') tenPhim: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number,
    @Query('tuNgay') tuNgay: string,
    @Query('denNgay') denNgay: string
  ) {
    try {
      return this.filmsService.getFilmsByDay(tenPhim, soTrang, soPhanTuTrenTrang, tuNgay, denNgay)
    } catch (err) { }
  }
  @Get('LayThongTinPhim')
  getInforFilm(@Query('maPhim') maPhim: number) {
    try {
      return this.filmsService.getInforFilm(maPhim)
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('ThemPhimUploadHinh')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Film })
  @UseInterceptors(FileInterceptor('file'))
  addFilms(@Body() body: Film, @UploadedFile() file: Express.Multer.File) {
    try {
      return this.filmsService.addFilms(file, body);
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('CapNhatPhimUpload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateFilmDto })
  @UseInterceptors(FileInterceptor('file'))
  updateFilms(@Body() body: UpdateFilmDto, @UploadedFile() file: Express.Multer.File) {
    try {
      return this.filmsService.updateFilms(file, body);
    } catch (err) { }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('XoaPhim')
  deleteFilms(@Query('maPhim') maPhim: number) {
    try {
      return this.filmsService.deleteFilms(maPhim)
    } catch (err) { }
  }


}
