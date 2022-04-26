import { PicturesDBService } from "@models/MongoDB/services/pictureDB.service";
import { GalleryObject } from "./gallery.interface";
import { Picture } from "@interfaces/picture.interface";
import { mongoConnectionService } from "@services/mongoConnection.service";
import { MultipartFile } from 'lambda-multipart-parser'
import { FileService } from "@services/file.service";
import { UserDBService } from "@models/MongoDB/services/userDB.service";
import { PictureError } from "../../errors/picture.error";

export class GalleryService {
  private fileService;
  private dbUsersService;
  private dbPicturesService;

  constructor() {
    this.fileService = new FileService();
    this.dbPicturesService = new PicturesDBService();
    this.dbUsersService = new UserDBService();
  }

  countTotalPagesAmount = async (limit: number, filter: string, email:string): Promise<number> => {
    try {
      await mongoConnectionService.connectDB();

      const user = await this.dbUsersService.findUserByEmail(email);
      const picturesPerPage = limit;
      const picturesTotal = await this.dbPicturesService.getPicturesAmount(user._id!, filter) || 0;
      const totalPages: number = Math.ceil(picturesTotal / picturesPerPage);

      return totalPages;
    } catch (err) {
      throw new PictureError('Failed to get pictures amount');
    }
  }

  createResponseObject = async (page: string, limit: number, filter: string, email: string): Promise<GalleryObject> => {
    try {
      await mongoConnectionService.connectDB();

      const user = await this.dbUsersService.findUserByEmail(email);
      const objects = await this.dbPicturesService.getPicturesFromDB(user._id!, Number(page), Number(limit) || 4, filter) || [] as Picture[];
      const total = await this.countTotalPagesAmount(limit, filter, email);
      const pageNumber = Number(page);

      return  {
        objects: objects,
        total,
        page: pageNumber
      }
    } catch (err) {
      throw new PictureError('Failed to create response object')
    }
  }

  uploadUserPicture = async (file: MultipartFile, email: string) => {
    try {
      await mongoConnectionService.connectDB();

      const picturesAmount = await this.dbPicturesService.getTotalImagesAmount();
      const user = await this.dbUsersService.findUserByEmail(email);

      const pictureName = await this.fileService.renameFile(file, picturesAmount);
      const metadata = await this.fileService.getFilesMetadata();
      console.log('metadata', metadata)
      console.log('amount', picturesAmount);

      const pictureObject: Picture = {
        path: pictureName!,
        metadata: metadata[picturesAmount],
        owner: user._id,
      }

      await this.dbPicturesService.addUserPicturesToDB(pictureObject);

      return {object: pictureObject};
    } catch (err) {
      throw new PictureError('Failed to upload a new picture');
    }
  }

  uploadDefaultPictures = async () => {
    try {
      await mongoConnectionService.connectDB();

      await this.dbPicturesService.addPicturesToTheDB();

      return { message: 'Default pictures were added' };
    } catch (err) {
      throw new PictureError('Failed to upload default images')
    }
  }
}