import {  Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {

  async transform(file: Express.Multer.File): Promise<string> {
    const originalName = path.parse(file.originalname).name;
    const filename = Date.now() + '_' + originalName + '.webp';

    await sharp(file.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(path.join(process.cwd()+ '/public/img', filename));

    return filename;
  }

}