import { AWSPartitial } from '../../types';
import { getPictures, httpApiJwtAuthorizer, uploadDefaultPictures, uploadPicture } from "./index";

export const galleryConfig: AWSPartitial = {
  functions: {
    httpApiJwtAuthorizer, getPictures, uploadDefaultPictures, uploadPicture
  },
}
