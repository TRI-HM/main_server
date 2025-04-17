import { UserModelSequelize } from "../models/userModel";
import { IUserModel } from "../models/userModel";

export const createUser = async (user: IUserModel): Promise<IUserModel> => {
  const newUser = await UserModelSequelize.create(user);
  return newUser;
}
