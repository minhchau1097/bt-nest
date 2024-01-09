import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";
export class Film {
    maPhim: number;
    @IsNotEmpty()
    @ApiProperty()
    tenPhim: string;
    @ApiProperty()
    @IsNotEmpty()
    trailer: string;
    @ApiProperty({ type: String, format: "binary" })
    file: any;
    @ApiProperty()
    @IsNotEmpty()
    moTa: string;
    @ApiProperty()
    @IsNotEmpty()
    // @IsDateString()
    ngayKhoiChieu: string;
    @ApiProperty({ type: Number })
    @IsNotEmpty()
    danhGia: number;
    @ApiProperty({ type: Boolean })
    hot: boolean;
    @ApiProperty({ type: Boolean })
    dangChieu: boolean;
    @ApiProperty({ type: Boolean })
    sapChieu: boolean;
}
