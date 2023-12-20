import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @ApiProperty()
  noiDung: string
  @ApiProperty()
  maBinhLuan: number
}
