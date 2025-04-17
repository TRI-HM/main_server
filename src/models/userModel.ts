import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const UserModelSequelize = SequelizeDB.define("userModel", {
  uuid: {
    type: DataTypes.UUIDV4,
    allowNull: false,
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
  mail: {
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
});

type UserModelSequelizeType = Omit<typeof UserModelSequelize, 'createdAt' | 'updatedAt'>;

export interface IUserModel {
  create: (user: UserModelSequelizeType) => Promise<IUserModel>; //Todo: create it
  update: (user: UserModelSequelizeType) => Promise<IUserModel>;
  getUser: (uuid: string) => Promise<IUserModel>;
  getAllUsers: () => Promise<IUserModel[]>;
  delete: (uuid: string) => Promise<IUserModel>;
}