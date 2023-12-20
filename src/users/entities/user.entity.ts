import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, } from "class-validator";

export class User {
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString({
        message: 'Tài khoản phải là chuỗi'
    })
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString({
        message: 'Họ tên phải là chuỗi'
    })
    hoTen: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, {
        message: 'Email không hợp lệ'
    })
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString({
        message: 'Số điện thoại phải là chuỗi'
    })
    soDt: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString({
        message: 'Mật khẩu phải là chuỗi'
    })
    matKhau: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString({
        message: 'Loại người dùng phải là chuỗi'
    })
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