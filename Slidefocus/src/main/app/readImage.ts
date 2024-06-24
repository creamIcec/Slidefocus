import { promises } from 'fs';
import path from 'path';

//读取图片(完整读取)

/* @future */
function readImageFull() {}

//读取图片(当前使用)
async function readImage(image_path: string) {
  const image = await promises.readFile(image_path, 'binary');

  // get image file extension name
  const extensionName = path.extname(image_path);

  // convert image file to base64-encoded string
  const base64Image = Buffer.from(image, 'binary').toString('base64');

  // combine all strings
  const base64ImageStr = `data:image/${extensionName
    .split('.')
    .pop()};base64,${base64Image}`;

  return base64ImageStr;
}

export { readImage };
