import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class Login {}
export class LoginUser {
    @ApiProperty()
    @IsNotEmpty()
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()
    matKhau: string;
}