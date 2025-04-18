import { UserClientType, UserModelSequelize, UserModelType, userUseCase } from "../models/userModel";
import { IUserUseCase } from "../models/userModel";

const createUser = (useCase: IUserUseCase) =>
  async (user: UserClientType): Promise<UserModelType | null> => {
    let newUser = await useCase.create(user);
    if (!newUser) return null;
    return newUser;
  }

const updateUser = (useCase: IUserUseCase) =>
  async (uuid: string, user: UserClientType): Promise<boolean> => {
    let updatedUser = await useCase.update(uuid, user);
    if (!updatedUser) return false;
    return true;
  }

const userService: IUserUseCase = {
  create: createUser(userUseCase),
  update: updateUser(userUseCase),
}

export default userService;
