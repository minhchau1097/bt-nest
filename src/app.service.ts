import { Injectable } from '@nestjs/common';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService {

  trimObjectValues(obj: User) {
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
  parseDate (value:number){
    const date = new Date(value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    return dateTimeString
  }
}
