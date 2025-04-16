import { User } from "../models/usersModel";

export const validateUser = (user: User) => {
  return user.email.includes("@");
};