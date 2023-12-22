import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFilmDto } from './create-film.dto';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {
    @ApiProperty({
        required:false
    })
    maPhim?: number;
}
