import { HttpBadRequestError } from "@floteam/errors";

export class HttpQueryError extends HttpBadRequestError {
  constructor(message? : string) {
    super(message);
    this.name = 'httpQueryErrorError';
  }
}