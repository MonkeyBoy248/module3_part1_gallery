import { HttpUnauthorizedError } from "@floteam/errors";

export class AuthenticationError extends HttpUnauthorizedError {
  constructor(message? : string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}