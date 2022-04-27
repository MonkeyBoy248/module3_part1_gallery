import { AuthService } from "./auth.service";
import { RequestUser } from "./auth.interface";
import { HttpBadRequestError, HttpUnauthorizedError } from "@floteam/errors";

export class AuthManager {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  validateUserData = (data: string) => {
    const userData = JSON.parse(data);

    if (!userData.email) {
      throw new HttpBadRequestError('No email was provided');
    }

    if (!userData.password) {
      throw new HttpBadRequestError('No password was provided')
    }

    const userObject: RequestUser = {
      email: userData.email,
      password: userData.password
    }

    return userObject;
  }

  signUp = async (data: string) => {
    const user = this.validateUserData(data);

    return this.service.signUp(user);
  }

  logIn = async (data: string) => {
    const user = this.validateUserData(data);

    return this.service.logIn(user);
  }

  uploadDefaultUsers = async () => {
    return this.service.uploadDefaultUsers();
  }

  authenticate = async (token: string) => {
    if (!token) {
      throw new HttpUnauthorizedError('No token was provided');
    }

    return this.service.authenticate(token);
  }
}
