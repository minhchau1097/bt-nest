import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class Login {}
export class LoginUser {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    matKhau: string;
}