import { User } from "../models/usersModelExample";

export const validateUser = (user: User) => {
  return user.email.includes("@");
};