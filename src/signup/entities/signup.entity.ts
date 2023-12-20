import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class Signup {}
export class User {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    taiKhoan: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hoTen: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    soDt: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    matKhau: string;
 

}