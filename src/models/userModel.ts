import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const UserModelSequelize = SequelizeDB.define("User", {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
  },
  gift: {
    type: DataTypes.STRING(255),
  },
  note: {
    type: DataTypes.STRING(255),
  },
  createdAt: {
    type: DataTypes.DATE(),
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE(),
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE(),
  }
},
  {
    tableName: "Users",
    freezeTableName: true,
  }
);

export type UserModelType = {
  uuid: string;
  fullname: string;
  phone: string;
  email?: string;
  gift?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
export type UserClientType = Omit<UserModelType, 'createdAt' | 'updatedAt' | 'deletedAt' | 'uuid'>;

export interface IUserUseCase {
  create: (user: UserClientType) => Promise<UserModelType | null>;
  update: (uuid: string, user: UserClientType) => Promise<boolean>;
  getOne: (uuid: string) => Promise<UserModelType | null>;
  getAll: () => Promise<UserModelType[] | null>;
  // delete: (uuid: string) => Promise<UserModelType | null>;
}

const createUser = async (user: UserClientType): Promise<UserModelType | null> => {
  const newUser = await UserModelSequelize.create(user);
  if (!newUser) return null;
  return newUser.dataValues as UserModelType;
}

const updateUser = async (uuid: string, user: UserClientType): Promise<boolean> => {
  const updatedUser = await UserModelSequelize.update(user, {
    where: { uuid }
  });
  if (!updatedUser) return false;
  return true;
}

const getOneUser = async (uuid: string): Promise<UserModelType | null> => {
  const user = await UserModelSequelize.findOne({ where: { uuid } });
  if (!user) return null;
  return user.dataValues as UserModelType;
}

const getAllUsers = async (): Promise<UserModelType[] | null> => {
  const users = await UserModelSequelize.findAll();
  if (!users) return null;
  return users.map(user => user.dataValues as UserModelType);
}


export const userUseCase: IUserUseCase = {
  create: createUser,
  update: updateUser,
  getOne: getOneUser,
  getAll: getAllUsers
}