import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class Comment {
    @ApiProperty()
    @IsNotEmpty()
    taiKhoan: string
    @ApiProperty()
    @IsNotEmpty()
    maPhim: number
    ngayBinhLuan: string
    @ApiProperty()
    @IsNotEmpty()
    noiDung: string
}
