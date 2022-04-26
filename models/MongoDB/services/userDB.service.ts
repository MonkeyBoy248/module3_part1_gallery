import { authorizedUsers } from '@helper/authorizedUsers';
import { UserModel } from '@models/MongoDB/user.model';
import { HashPasswordService } from '@services/hashPassword.service'
import { User } from '@interfaces/user.interface'
import { UserError } from "../../../errors/userError.error";
import { ObjectId } from "mongodb";
import { RequestUser } from "../../../api/authentication/auth.interface";

export class UserDBService {
  private hashService = new HashPasswordService();

  addUsersToDB = async () => {
    const newUsers: User[] = [];

    for (let user of authorizedUsers) {
      const hashedPassword = await this.hashService.hashPassword(user.password);

      if ((await UserModel.exists({ email: user.email })) === null) {
        newUsers.push({
          _id: new ObjectId(),
          email: user.email,
          password: hashedPassword.hash,
          salt: hashedPassword.salt,
        });
      }
    }

    await Promise.all(
      newUsers.map(async (item) => await UserModel.create(item))
    );
  };

  addNewUserToDB = async (userData: RequestUser) => {
    const email = userData.email;
    const hashedPassword = await this.hashService.hashPassword(userData.password);

    const newUserObject: User = {
      _id: new ObjectId(),
      email,
      password: hashedPassword.hash,
      salt: hashedPassword.salt
    }

    await UserModel.create(newUserObject);
  }

  findUserByEmail = async (email: string): Promise<User> => {
    const user = await UserModel.findOne({email});

    if (user === null) {
      throw new UserError('User does not exist');
    }

    return user;
  }
}
