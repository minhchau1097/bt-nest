import { Injectable } from '@nestjs/common';
import { User } from './users/entities/user.entity';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Injectable()
export class AppService {

  trimObjectValues(obj: User| UpdateUserDto) {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/\s/g, '');
      }
    }
    return obj;
  }
  trimValue(value: string) {
    value = value.replace(/\s/g, '');
    return value;
  }
  parseBoolean(value: string): boolean {
    return value.toLowerCase() === "true";
  }
  
  response(data: any, statusCode = 200, message = 'Xử lý thành công!') {
    return {
      message,
      statusCode,
      content: data
    }
  }
}
