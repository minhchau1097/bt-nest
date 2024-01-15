import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
moment.locale('vi')
@Injectable()
export class CommentsService extends AppService {
  constructor(private prisma: PrismaService) {
    super()
  }
  async getAllComments(maPhim: number) {
    const phim = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    if (!phim) throw new BadRequestException('Phim không tồn tại')
    const data = await this.prisma.binh_luan.findMany({
      where: {
        maPhim,
      }, orderBy: {
        ngayBinhLuan: 'desc'
      }

    });
    const newData = data.map(item => ({ ...item, ngayBinhLuan: moment(item.ngayBinhLuan).fromNow() }))
    return this.response(newData)
  }
  async createComment(body: CreateCommentDto) {
    const { maPhim, noiDung, taiKhoan } = body
    const phim = await this.prisma.phim.findFirst({
      where: {
        maPhim
      }
    })
    if (!phim) throw new BadRequestException('Phim không tồn tại')
    const user = await this.prisma.nguoi_dung.findFirst({
      where: {
        taiKhoan
      }
    })
    if (!user) throw new BadRequestException('Tài khoản không tồn tại')
    const data = {
      taiKhoan,
      maPhim,
      ngayBinhLuan: moment().format(),
      noiDung
    }
    const comment = await this.prisma.binh_luan.create({ data })
    return this.response(comment, 201)
  }
  async deleteComment(maBinhLuan: number) {
    const comment = await this.prisma.binh_luan.findFirst({
      where: {
        maBinhLuan
      }
    })
    if (!comment) throw new BadRequestException('Bình luận không tồn tại')
    await this.prisma.binh_luan.delete({
      where: {
        maBinhLuan: comment.maBinhLuan
      }
    })
    return this.response('Xoá thành công', 200)
  }
  async editComment(body: UpdateCommentDto) {
    const { maBinhLuan, noiDung } = body
    const comment = await this.prisma.binh_luan.findFirst({
      where: {
        maBinhLuan
      }
    })
    if (!comment) throw new BadRequestException('Bình luận không tồn tại')
    const data = {
      ngayBinhLuan: moment().format(),
      noiDung
    }
    await this.prisma.binh_luan.update({
      where: {
        maBinhLuan: comment.maBinhLuan
      }, data
    })
    return this.response('Cập nhật thành công', 201)
  }
}
