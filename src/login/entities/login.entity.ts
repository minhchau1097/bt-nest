import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class Login {}
export class LoginUser {
    @ApiProperty()
    @IsNotEmpty({
        message:'Tài khoản không được rỗng'
    })
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty({
        message:'Mật khẩu không được rỗng'
    })
    matKhau: string; 
}  