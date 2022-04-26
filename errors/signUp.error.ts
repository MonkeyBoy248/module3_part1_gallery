import { AlreadyExistsError } from "@floteam/errors";

export class SignUpError extends AlreadyExistsError {
  constructor(message : string) {
    super(message);
    this.name = 'SignUpError';
  }
}