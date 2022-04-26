import { HttpInternalServerError } from "@floteam/errors";

export class PictureError extends HttpInternalServerError {
  constructor(message? : string) {
    super(message);
    this.name = 'PictureError';
  }
}