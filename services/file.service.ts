import { paths } from '@helper/paths/paths'
import {Stats} from 'fs';
import fs from 'fs';
import path from 'path';
import { MultipartFile } from 'lambda-multipart-parser';
import { FileOperationError } from '../errors/fileOperation.error';


export class FileService {
  getFileNames = async () => {
    console.log(paths.API_IMAGES_PATH);
    try {
      const fileNames = await fs.promises.readdir(paths.API_IMAGES_PATH);

      if (fileNames.length === 0) {
        return [];
      }

      return fileNames;
    } catch (err) {
      throw new FileOperationError('Failed to get file names list')
    }
  }

  getFilesMetadata = async () => {
    const { API_IMAGES_PATH } = paths;
    const imageNames = await this.getFileNames();
    const metadataArray: Stats[] = await Promise.all(imageNames.map(async (fileName) => {
      return fs.promises.stat(path.join(API_IMAGES_PATH, fileName));
    }));
    
    return metadataArray;
  }

  renameFile = async (fileData: MultipartFile, picturesAmount: number) => {
    const fileName = fileData.filename;
    try {
      const pictureName = `user_image_${picturesAmount + 1}${fileName.slice(fileName.indexOf('.'))}`;

      await fs.promises.writeFile(
        path.join(paths.API_IMAGES_PATH, pictureName),
        fileData.content
      );

      return pictureName;
    } catch (err) {
      throw new FileOperationError('Failed to rename file');
    }
  }
}
