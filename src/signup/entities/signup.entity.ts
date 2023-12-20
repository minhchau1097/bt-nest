import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class Signup {}
export class User {
    @ApiProperty()
    @IsNotEmpty()
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()
    hoTen: string;
    @ApiProperty()
    @IsNotEmpty()
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    soDt: string;
    @ApiProperty()
    @IsNotEmpty()
    matKhau: string;
 

}