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

const getOneUser = (useCase: IUserUseCase) =>
  async (uuid: string): Promise<UserModelType | null> => {
    let user = await useCase.getOne(uuid);
    if (!user) return null;
    return user;
  }

const getAllUsers = (useCase: IUserUseCase) =>
  async (): Promise<UserModelType[] | null> => {
    let users = await useCase.getAll();
    if (!users) return null;
    return users;
  }

const userService: IUserUseCase = {
  create: createUser(userUseCase),
  update: updateUser(userUseCase),
  getOne: getOneUser(userUseCase),
  getAll: getAllUsers(userUseCase),
}

export default userService;
