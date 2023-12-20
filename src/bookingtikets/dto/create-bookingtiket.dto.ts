import { ApiBody, ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
export class Ticket {
    @ApiProperty()
    @IsNotEmpty()
    maGhe: number
    @ApiProperty()
    @IsNotEmpty()
    giaVe: number
}
@ApiExtraModels(Ticket)
export class CreateBookingtiketDto {

    @ApiProperty()
    @IsNotEmpty()
    maLichChieu: number
    @ApiProperty({
        type: 'array',
        items:{
            allOf:[
                {$ref:getSchemaPath(Ticket)}
            ]
        }
    })
    @IsNotEmpty()
    danhSachVe: Ticket[]
}

export class CreateShowtimeDto {
    @ApiProperty()
    @IsNotEmpty()
    maPhim: number
    @ApiProperty()
    @IsNotEmpty()
    ngayChieuGioChieu: string
    @ApiProperty()
    @IsNotEmpty()
    giaVe: number
    @ApiProperty()
    @IsNotEmpty()
    maRap: number
}