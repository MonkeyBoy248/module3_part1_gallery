import { HttpBadRequestError } from "@floteam/errors";

export class DbConnectionError extends HttpBadRequestError {
  constructor(message? : string) {
    super(message);
    this.name = 'DBConnectionError';
  }
}