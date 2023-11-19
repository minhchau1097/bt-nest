import { Injectable, NotFoundException } from '@nestjs/common';
import { Arr, CreateTheaterDto, ListMovie } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) { }
  async getTheaterSystem(id: string = '') {
    let data = await this.prisma.he_thong_rap.findMany({
      where: {
        maHeThongRap: {
          contains: id
        }
      }
    })
    return {
      message: 'Xử lý thành công!',
      statusCode: '200',
      content: data
    };
  }
  async getTheaterCluster(id: string = '') {
    let cumRap = await this.prisma.cum_rap.findMany({
      where: {
        maHeThongRap: {
          contains: id
        }
      },
      include: {
        rap_phim: true
      }
    })
    let data = cumRap?.map((item) => {

      return {
        maCumRap: item.maCumRap,
        tenCumRap: item.tenCumRap,
        diaChi: item.diaChi,
        danhSanhRap: item.rap_phim.map((item) => {
          return { maRap: item.maRap, tenRap: item.tenRap }
        })
      }
    })
    return {
      message: 'Xử lý thành công!',
      statusCode: '200',
      content: data
    };
  }

  async getTheaterShowtimes(id: string) {

    let data = await this.prisma.he_thong_rap.findMany({
      where: {
        maHeThongRap: {
          contains: id
        }
      },
      include: {
        cum_rap: {
          include: {
            rap_phim: {
              include: {
                lich_chieu: {
                  include: {
                    phim: true
                  }
                }
              }
            }
          }
        }
      }
    })
    

    const newData = data.map(item => {

      return {
        lstCumRap: item.cum_rap.map(cumRap => {

          return {
            danhSachPhim: cumRap.rap_phim.flatMap(rapPhim => rapPhim.lich_chieu.filter(item => item.maPhim === item.phim.maPhim).map(lichChieu => {

              return {
                lstLichChieuTheoPhim: rapPhim.lich_chieu.filter(item => item.maPhim === lichChieu.phim.maPhim).flatMap(item => {
                  if (item.maRap !== lichChieu.maRap) return
                  return {
                    maLichChieu: item.maLichChieu,
                    giaVe: item.giaVe,
                    maRap: rapPhim.maRap,
                    tenRap: rapPhim.tenRap,
                    ngayChieuGioChieu: item.ngayChieuGioChieu,
                  }
                }),
                maPhim: lichChieu.phim.maPhim,
                tenPhim: lichChieu.phim.tenPhim,
                hinhAnh: lichChieu.phim.hinhAnh,
                dangChieu: lichChieu.phim.dangChieu,
                sapChieu: lichChieu.phim.sapChieu,
                hot: lichChieu.phim.hot,
              }
            })),
            diaChi: cumRap.diaChi,
            tenCumRap: cumRap.tenCumRap,
            maCumRap: cumRap.maCumRap,
          }
        }),
        logo: item.logo,
        maHeThongRap: item.maHeThongRap,
        tenHeThongRap: item.tenHeThongRap,
      }
    })



    return {
      message: 'Xử lý thành công!',
      statusCode: '200',
      content: newData
    };
  }

  async getTheaterShowtimeInfor(id: number) {
    if (!id) throw new NotFoundException('Không tìm thấy tài nguyên')
    let phim = await this.prisma.phim.findFirst({
      where: {
        maPhim: id
      }

    })
    if(!phim) throw new NotFoundException('Phim không tồn tại')
    const { maPhim, moTa, ngayKhoiChieu, sapChieu, dangChieu, danhGia, hinhAnh, hot, trailer, tenPhim } = phim
    let heThong = await this.prisma.he_thong_rap.findMany({
      include: {
        cum_rap: {
          include: {
            rap_phim: {
              include: {
                lich_chieu: {
                  where: {
                    maPhim
                  }
                }
              }

            }
          }
        }
      }
    })
    let lichChieu = heThong.flatMap(item => item.cum_rap.flatMap(cumRap => cumRap.rap_phim.flatMap(rapPhim => rapPhim.lich_chieu.flatMap(lichChieu => lichChieu))))
    let filterLichChieu = lichChieu.map(item => item.maRap)
    let rapPhim = heThong.flatMap(item => item.cum_rap.flatMap(cumRap => cumRap.rap_phim.flatMap(rapPhim => rapPhim).filter(item => filterLichChieu.includes(item.maRap))))
    let filterRapPhim = rapPhim.map(item => item.maCumRap)
    let cumRap = heThong.flatMap(item => item.cum_rap.flatMap(cumRap => cumRap).filter(item => filterRapPhim.includes(item.maCumRap)))
    let filterCumRap = cumRap.map(item => item.maHeThongRap)
    let heThongRap = heThong.flatMap(item => item).filter(item => filterCumRap.includes(item.maHeThongRap))

    let data = {
      heThongRapChieu: heThongRap.map(item => {
        const { logo, maHeThongRap, tenHeThongRap } = item
        return {
          cumRapChieu: cumRap.map(cumRap => {
            const { maCumRap, tenCumRap, diaChi, maHeThongRap } = cumRap
            return {
              lichChieuPhim: rapPhim.filter(item => item.maCumRap === maCumRap).flatMap(item => item.lich_chieu.flatMap(lichChieu => {
                const { tenRap } = item
                const { maLichChieu, maRap, ngayChieuGioChieu, giaVe } = lichChieu
                return {
                  maLichChieu,
                  maRap,
                  tenRap,
                  ngayChieuGioChieu,
                  giaVe,
                }
              })),
              maCumRap,
              tenCumRap,
              diaChi,
            }
          }),
          logo,
          tenHeThongRap,
          maHeThongRap
        }

      }),
      tenPhim,
      maPhim,
      hinhAnh,
      moTa,
      trailer,
      danhGia,
      ngayKhoiChieu,
      dangChieu,
      sapChieu,
      hot,
    }

    return {
      message: 'Xử lý thành công!',
      statusCode: '200',
      content: data
    };
  }




  
}
