import { ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiPropertyOptional()
    tuKhoa:string;
    @ApiPropertyOptional()
    soTrang:number;
    @ApiPropertyOptional()
    soPhanTuTrenTrang:number;

}
