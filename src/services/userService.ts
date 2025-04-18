import { UserClientType, UserModelSequelize, UserModelType, userUseCase } from "../models/userModel";
import { IUserUseCase } from "../models/userModel";

const createUser = (useCase: IUserUseCase) =>
  async (user: UserClientType): Promise<UserModelType | null> => {
    let newUser = await useCase.create(user);
    if (!newUser) return null;
    return newUser;
  }

const userService: IUserUseCase = {
  create: createUser(userUseCase),
}

export default userService;
