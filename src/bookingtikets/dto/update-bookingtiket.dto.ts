import { PartialType } from '@nestjs/swagger';
import { CreateBookingtiketDto } from './create-bookingtiket.dto';

export class UpdateBookingtiketDto extends PartialType(CreateBookingtiketDto) {}
