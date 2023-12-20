import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class User {
    id: number;
    @ApiProperty()
    @IsNotEmpty()

    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()

    hoTen: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, {
        message: 'Email không hợp lệ'
    })
    email: string;
    @ApiProperty()
    @IsNotEmpty()

    soDt: string;
    @ApiProperty()
    @IsNotEmpty()

    matKhau: string;
    @ApiProperty()
    @IsNotEmpty()

    loaiNguoiDung: string;
}
export class SearchUser {
    @ApiPropertyOptional()
    tuKhoa: string;
    @ApiPropertyOptional()
    soTrang: number;
    @ApiPropertyOptional()
    soPhanTuTrenTrang: number;

}