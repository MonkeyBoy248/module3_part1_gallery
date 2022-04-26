import { HttpBadRequestError } from "@floteam/errors";

export class UserError extends HttpBadRequestError {
  constructor(message : string) {
    super(message);
    this.name = 'UserError';
  }
}