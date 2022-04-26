import { AuthService } from "./auth.service";
import { UserError } from "../../errors/user.error";
import { RequestUser } from "./auth.interface";
import { AuthenticationError } from "../../errors/authentication.error";

export class AuthManager {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  validateUserData = (data: string) => {
    const userData = JSON.parse(data);

    if (!userData.email) {
      throw new UserError('No email was provided');
    }

    if (!userData.password) {
      throw new UserError('No password was provided')
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
      throw new AuthenticationError('No token was provided');
    }

    return this.service.authenticate(token);
  }
}
