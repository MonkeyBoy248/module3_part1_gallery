import { Picture } from "@interfaces/picture.interface";
import { PictureModel } from "@models/MongoDB/picture.model";
import { FileService } from "@services/file.service";
import { ObjectId } from "mongodb";
import { HttpBadRequestError, HttpInternalServerError } from "@floteam/errors";

export class PicturesDBService {
  private fileService = new FileService();

  addPicturesToTheDB = async () => {
    try {
      const picturesInfo = await this.fileService.getFilesInfo();

      const newPicturesList: (Picture | undefined)[] = await Promise.all(picturesInfo.fileNames.map(async (fileName, index) => {
        if (await PictureModel.exists({path: fileName}) === null) {
          return {
            path: fileName,
            metadata: picturesInfo.metadata[index],
            owner: null,
          } as Picture;
        }
      }));

      await Promise.all(newPicturesList.map(async (item) => {
        await PictureModel.create(item);
        console.log(`item ${item} added`);
      }));
    } catch (err) {
     throw new HttpBadRequestError('Picture already exists')
    }
  }

  addUserPicturesToDB = async (pictureObject: Picture) => {
    try {
      await PictureModel.create(pictureObject);
    } catch (err) {
      throw new HttpInternalServerError('Failed to upload picture', err.message)
    }
  }

  getTotalImagesAmount = async () => {
    return await PictureModel.estimatedDocumentCount();
  }

  getPicturesFromDB = async (ownerId: ObjectId, page : number, limit: number, filter: string) => {
    let filterQuery = filter === 'false' ? {$or: [{owner: null}, {owner: ownerId}]} : {owner: ownerId};

    try {
      return await PictureModel.find(filterQuery, null, {skip: limit * page - limit, limit: limit});
    } catch (err) {
      throw new HttpInternalServerError('Failed to get pictures ', err.message);
    }

  }

  getPicturesAmount = async (id: ObjectId, filter: string) => {
    let filterQuery = filter === 'false' ? {$or: [{owner: null}, {owner: id}]} : {owner: id};

    return await PictureModel.countDocuments(filterQuery);
  }

  isUserPicturesEmpty = async (id: ObjectId) => {
    return await PictureModel.countDocuments({owner: id}) === 0;
  }
}
