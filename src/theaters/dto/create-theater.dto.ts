export class CreateTheaterDto { }
export interface ListMovie{
    lstChieuTheoPhim: any;
    maPhim: number;
    tenPhim: string;
    hinhAnh: string;
    dangChieu: boolean;
    sapChieu: boolean;
    hot: boolean;
}

export interface Arr<ListMovie>{
    data: ListMovie[]
}