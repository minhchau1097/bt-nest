import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, HttpCode, } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Film } from './dto/create-film.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFilmDto } from './dto/update-film.dto';
@ApiTags('QuanLyPhim')
@Controller('api/QuanLyPhim')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) { }

  @Get('LayDanhSachBanner')
  getBanner() {
    return this.filmsService.getBanner();
  }

  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'tenPhim', required: false })
  getFilms(@Query('tenPhim') tenPhim: string) {
    return this.filmsService.getFilms(tenPhim);
  }

  @Post('ThemPhimUploadHinh')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Film })
  @UseInterceptors(FileInterceptor('file'))
  addFilms(@Body() body: Film, @UploadedFile() file: Express.Multer.File) {
    return this.filmsService.addFilms(file, body);
  }
  @Post('CapNhatPhimUpload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateFilmDto })
  @UseInterceptors(FileInterceptor('file'))
  updateFilms(@Body() body: UpdateFilmDto, @UploadedFile() file: Express.Multer.File) {
    return this.filmsService.updateFilms(file, body);
  }
  @Delete('XoaPhim')
  deleteFilms(@Query('maPhim') maPhim: number) {
    return this.filmsService.deleteFilms(maPhim)
  }

  @Get('LayThongTinPhim')
  getInforFilm(@Query('maPhim') maPhim: number){
    return this.filmsService.getInforFilm(maPhim)
  }
}
