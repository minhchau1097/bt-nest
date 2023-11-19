import { PartialType } from '@nestjs/swagger';
import { Film } from './create-film.dto';

export class UpdateFilmDto extends PartialType(Film) {
    file?: any;
}
