import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateBookingtiketDto { }
export class CreateShowtime {
    @ApiProperty()
    @IsNotEmpty({
        message: 'maPhim không được rỗng'
    })
    maPhim: number
    @ApiProperty()
    @IsNotEmpty({})
    ngayChieuGioChieu: string
    @ApiProperty()
    @IsNotEmpty()
    giaVe: number
    @ApiProperty()
    @IsNotEmpty()
    maRap: number
}
