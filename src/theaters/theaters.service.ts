import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppService } from 'src/app.service';
import * as moment from 'moment';
import 'moment/locale/vi'
import { cum_rap, he_thong_rap, rap_phim } from '@prisma/client';
moment.locale('vi')
@Injectable()
export class TheatersService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }
  async getTheaterSystem(id: string = '') {
    let data = await this.prisma.he_thong_rap.findMany({
      where: {
        maHeThongRap: {
          contains: id
        }
      }
    })
    if (data.length === 0) throw new InternalServerErrorException('Mã hệ thống không tồn tại')
    return this.response(data);

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
        danhSachRap: item.rap_phim.map((item) => {
          return { maRap: item.maRap, tenRap: item.tenRap }
        })
      }
    })
    return this.response(data)

  }
  async getTheaterShowtimes(id: string) {
    const data = await this.prisma.he_thong_rap.findMany({
      where: {
        maHeThongRap: {
          contains: id
        }
      },
      include: {
        cum_rap: true
      }
    });

    const [phim, lichChieu] = await Promise.all([
      this.prisma.phim.findMany({
        include: {
          lich_chieu: {
            include: {
              rap_phim: true
            }
          }
        }
      }),
      this.prisma.lich_chieu.findMany({
        include: {
          rap_phim: true
        }
      })
    ]);

    const newData = data.map(item => {
      const lstCumRap = [];
      item.cum_rap.forEach(cumRap => {
        const arrDanhSach = [];
        phim.forEach(phim => {
          lichChieu.forEach(item => {
            if (phim.maPhim === item.maPhim && cumRap.maCumRap === item.rap_phim.maCumRap) {
              const index = arrDanhSach.findIndex(danhSanh => danhSanh.maPhim === item.maPhim);
              if (index === -1) {
                const lstLichChieuTheoPhim = lichChieu
                  .filter(lichChieu => lichChieu.maPhim === phim.maPhim && lichChieu.rap_phim.maCumRap === cumRap.maCumRap)
                  .map(item2 => ({
                    maLichChieu: item2.maLichChieu,
                    giaVe: item2.giaVe,
                    maRap: item2.rap_phim.maRap,
                    tenRap: item2.rap_phim.tenRap,
                    ngayChieuGioChieu: moment(item2.ngayChieuGioChieu).format(),
                  }));
                arrDanhSach.push({
                  lstLichChieuTheoPhim,
                  maPhim: phim.maPhim,
                  tenPhim: phim.tenPhim,
                  hinhAnh: phim.hinhAnh,
                  dangChieu: phim.dangChieu,
                  sapChieu: phim.sapChieu,
                  hot: phim.hot,
                });
              }
            }
          });
        });
        lstCumRap.push({
          danhSachPhim: arrDanhSach,
          diaChi: cumRap.diaChi,
          tenCumRap: cumRap.tenCumRap,
          maCumRap: cumRap.maCumRap,
        });
      });

      return {
        lstCumRap,
        logo: item.logo,
        maHeThongRap: item.maHeThongRap,
        tenHeThongRap: item.tenHeThongRap,
      };
    });

    return this.response(newData);
  }

  async getTheaterShowtimeInfor(id: number) {
    if (!id) {
      throw new NotFoundException('Không tìm thấy tài nguyên');
    }

    const phim = await this.prisma.phim.findFirst({
      where: {
        maPhim: id,
      },
      include: {
        lich_chieu: {
          include: {
            rap_phim: {
              include: {
                cum_rap: {
                  include: {
                    he_thong_rap: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!phim) {
      throw new NotFoundException('Phim không tồn tại');
    }

    const {
      maPhim,
      moTa,
      ngayKhoiChieu,
      sapChieu,
      dangChieu,
      danhGia,
      hinhAnh,
      hot,
      trailer,
      tenPhim,
      lich_chieu,
    } = phim;



    const cumRapMap: Map<string, cum_rap> = new Map();
    const rapPhimMap: Map<string, rap_phim> = new Map();
    const heThongRapMap: Map<string, he_thong_rap> = new Map();
    for (const lichChieuItem of lich_chieu) {
      const rapPhim = lichChieuItem.rap_phim;

      if (!rapPhimMap.has(`${rapPhim.maRap}`)) {
        rapPhimMap.set(`${rapPhim.maRap}`, rapPhim);
      }

      const cumRap = rapPhim.cum_rap;

      if (!cumRapMap.has(cumRap.maCumRap)) {
        cumRapMap.set(cumRap.maCumRap, cumRap);
      }
      const heThongRap = cumRap.he_thong_rap;

      if (!heThongRapMap.has(heThongRap.maHeThongRap)) {
        heThongRapMap.set(heThongRap.maHeThongRap, heThongRap);
      }
    }

    const arrCum: cum_rap[] = Array.from(cumRapMap.values());
    const arrRap: rap_phim[] = Array.from(rapPhimMap.values());
    const arrHeThong: he_thong_rap[] = Array.from(heThongRapMap.values());

    const heThongRapChieu = [];

    for (const heThong of arrHeThong) {
      const { logo, maHeThongRap, tenHeThongRap } = heThong;

      const cumRapChieu = arrCum
        .filter((cumRap) => cumRap.maHeThongRap === maHeThongRap)
        .map((cumRap) => {
          const { maCumRap, tenCumRap, diaChi } = cumRap;

          const arrLich = [];

          for (const rap of arrRap) {
            const { tenRap, maRap } = rap;

            if (maCumRap === rap.maCumRap) {
              const lichChieuFilter = lich_chieu.filter(
                (item) => item.maRap === maRap
              );

              for (const item of lichChieuFilter) {
                const { maLichChieu, maRap, ngayChieuGioChieu, giaVe } = item;

                arrLich.push({
                  maLichChieu,
                  maRap,
                  tenRap,
                  ngayChieuGioChieu,
                  giaVe,
                });
              }
            }
          }

          return {
            lichChieuPhim: arrLich,
            maCumRap,
            tenCumRap,
            diaChi,
          };
        });

      heThongRapChieu.push({
        cumRapChieu,
        logo,
        tenHeThongRap,
        maHeThongRap,
      });
    }

    const data = {
      heThongRapChieu,
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
    };

    return this.response(data);
  }



}
