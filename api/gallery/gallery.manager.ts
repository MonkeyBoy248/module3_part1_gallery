import { GalleryService } from "./gallery.service";
import { HttpQueryError } from "../../errors/httpQuery.error";
import { MultipartRequest } from "lambda-multipart-parser";
import { FileOperationError } from "../../errors/fileOperation.error";

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  createResponseObject = async (page: string = '1', limit: number = 4, filter: string = 'false', email: string) => {
    if (Number(page) < 1 || Number(page) > await this.service.countTotalPagesAmount(limit, filter, email)) {
      throw new HttpQueryError('Incorrect query parameters');
    }

    return this.service.createResponseObject(page, limit, filter, email);
  }

  uploadUserPicture = async (file: MultipartRequest, email: string) => {
    if (file.files.length === 0) {
      throw new FileOperationError('No file to upload');
    }

    return this.service.uploadUserPicture(file.files[0], email);
  }

  uploadDefaultPictures = async () => {
    return this.service.uploadDefaultPictures();
  }
}
