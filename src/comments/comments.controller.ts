import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyBinhLuan')
@Controller('api/QuanLyBinhLuan')
@UseFilters(HttpExceptionFilter)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }
  @Get('LayBinhLuanTheoPhim/:maPhim')
  @ApiParam({
    name: 'maPhim', required: true
  })
  getAllComments(@Param('maPhim') maPhim: string) {
    try {
      return this.commentsService.getAllComments(+maPhim)
    } catch (error) {

    }
  }
  @Post('ThemBinhLuan') 
  @ApiBody({
    type: CreateCommentDto
  })
  createComment(@Body() body: CreateCommentDto) {
    try {
      return this.commentsService.createComment(body)
    } catch (error) {

    }
  }
  @Put('SuaBinhLuan')
  @ApiBody({
    type: UpdateCommentDto
  })
  editComment(@Body() body: UpdateCommentDto) {
    try {
      return this.commentsService.editComment(body)
    } catch (error) {

    }
  }
  @Delete('XoaBinhLuan')
  @ApiQuery({
    name: 'maBinhLuan'
  })
  deleteComment(@Query('maBinhLuan') maBinhLuan: number) {
    try {
      return this.commentsService.deleteComment(+maBinhLuan)
    } catch (error) {

    }
  }
}
