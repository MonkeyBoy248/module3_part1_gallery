import { authorizedUsers } from '@helper/authorizedUsers';
import { UserModel } from '@models/MongoDB/user.model';
import { HashPasswordService } from '@services/hashPassword.service'
import { User } from '@interfaces/user.interface'
import { UserError } from "../../../errors/user.error";
import { ObjectId } from "mongodb";
import { RequestUser } from "../../../api/authentication/auth.interface";

export class UserDBService {
  private hashService;

  constructor() {
    this.hashService = new HashPasswordService();
  }

  private createUserObject = async (email, password, salt) => {
    const userObject: User = {
      _id: new ObjectId(),
      email,
      password,
      salt
    } as User;

    return userObject;
  }

  saveUsersToDB = async (userData?: RequestUser) => {
    if (userData) {
      const email = userData.email;
      const hashedPassword = await this.hashService.hashPassword(userData.password);

      const newUserObject = await this.createUserObject(email, hashedPassword.hash, hashedPassword.salt);
      await UserModel.create(newUserObject);

      return;
    }

    const newUsers: (User | undefined)[] = await Promise.all(authorizedUsers.map(async (user) => {
      const hashedPassword = await this.hashService.hashPassword(user.password);

      if (await UserModel.exists({ email: user.email }) === null) {
        return this.createUserObject(user.email, hashedPassword.hash, hashedPassword.salt);
      }
    }));

    await Promise.all(
      newUsers.map(async (item) => UserModel.create(item))
    );
  };

  findUserByEmail = async (email: string): Promise<User> => {
    const user = await UserModel.findOne({email});

    if (user === null) {
      throw new UserError('User does not exist');
    }

    return user;
  }
}
