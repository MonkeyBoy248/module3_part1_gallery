import { RequestUser } from "./auth.interface";
import { mongoConnectionService } from "@services/mongoConnection.service";
import { UserDBService } from "@models/MongoDB/services/userDB.service";
import { HashPasswordService } from "@services/hashPassword.service";
import { JwtService} from "@services/jwt.service";
import { SignUpError } from "../../errors/signUp.error";
import { UserError } from "../../errors/user.error";
import { AuthenticationError } from "../../errors/authentication.error";

export class AuthService {
  private readonly dbUsersService;
  private readonly jwtService;
  private readonly hashService;


  constructor() {
    this.jwtService = new JwtService();
    this.dbUsersService = new UserDBService();
    this.hashService = new HashPasswordService();
  }

  signUp = async (userData: RequestUser) => {
    try {
      await mongoConnectionService.connectDB();

      const newUser = await this.dbUsersService.addNewUserToDB(userData);

      return {user: newUser, message: 'User successfully added'}
    } catch (err) {
      throw new SignUpError('User with this email already exists')
    }
  }

  logIn = async (userData: RequestUser) => {
    try {
      await mongoConnectionService.connectDB();

      const contender = await this.dbUsersService.findUserByEmail(userData.email);

      await this.hashService.comparePasswords(contender.password, contender.salt, userData.password);

      return this.jwtService.createToken(contender.email);
    } catch (err) {
      throw new AuthenticationError('Wrong user data');
    }
  }

  authenticate = async (token: string) => {
    try {
      await mongoConnectionService.connectDB();

      return this.jwtService.verifyToken(token);
    } catch (err) {
      throw new AuthenticationError('Invalid token');
    }
  }

  uploadDefaultUsers = async () => {
    try {
      await mongoConnectionService.connectDB();

      await this.dbUsersService.addUsersToDB();

      return {message: 'Default users were successfully added'}
    } catch (err) {
      throw new UserError('Failed to upload users');
    }
  }
}