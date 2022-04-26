import { HttpBadRequestError } from "@floteam/errors";

export class FileOperationError extends HttpBadRequestError {
  constructor(message? : string) {
    super(message);
    this.name = 'FileOperationError';
  }
}