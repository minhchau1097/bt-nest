export class Auth {}
export class User {
    taiKhoan: string;
    hoTen: string;
    email: string;
    soDt: string;
    matKhau: string;
    loaiNguoiDung: string;
}

export class LoginUser extends User {
    constructor() {
        super()
        this.taiKhoan;
        this.matKhau;
    }
}