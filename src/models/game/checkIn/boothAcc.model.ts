'use strict';
import { DataTypes } from "sequelize";
import SequelizeDB from "../../../database/db";
import { BoothModelSequelize } from "./booths.model";

export const BoothAccountModelSequelize = SequelizeDB.define("booth_accounts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boothCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: BoothModelSequelize,
      key: 'boothCode'
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff', 'manager'),
    allowNull: false,
    defaultValue: 'staff',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DataTypes.DATE(),
    allowNull: true
  },
  deletedAt: {
    type: DataTypes.DATE(),
    allowNull: true
  }
});

export type BoothAccountModelType = {
  id: number;
  username: string;
  password: string;
  boothCode: string;
  role: 'admin' | 'staff' | 'manager';
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type BoothAccountModelClientType = Omit<BoothAccountModelType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface IBoothAccountUseCase {
  create: (boothAccount: BoothAccountModelClientType) => Promise<BoothAccountModelType | null>;
  getOneByUsername: (username: string) => Promise<BoothAccountModelType | null>;
  update: (id: number, boothAccount: BoothAccountModelClientType) => Promise<BoothAccountModelType | null>;
  getBoothCodeByUsername: (username: string) => Promise<BoothAccountModelType | null>;
}

const create = async (boothAccount: BoothAccountModelClientType): Promise<BoothAccountModelType | null> => {
  try {
    const newAccount = await BoothAccountModelSequelize.create(boothAccount);
    if (!newAccount) return null;
    return newAccount.dataValues as BoothAccountModelType;
  } catch (error) {
    console.error('Error creating booth account:', error);
    return null;
  }
}

const getOneByUsername = async (username: string): Promise<BoothAccountModelType | null> => {
  try {
    const account = await BoothAccountModelSequelize.findOne({ where: { username } });
    if (!account) return null;
    return account.dataValues as BoothAccountModelType;
  } catch (error) {
    console.error('Error getting booth account by username:', error);
    return null;
  }
}
const update = async (id: number, boothAccount: BoothAccountModelClientType): Promise<BoothAccountModelType | null> => {
  try {
    const [updatedRows] = await BoothAccountModelSequelize.update(boothAccount, { where: { id } });
    if (!updatedRows) return null;
    const updatedAccount = await BoothAccountModelSequelize.findOne({ where: { id } });
    if (!updatedAccount) return null;
    return updatedAccount.dataValues as BoothAccountModelType;
  } catch (error) {
    throw new Error('Failed to update booth account');
  }
}

const getBoothCodeByUsername = async (username: string): Promise<BoothAccountModelType | null> => {
  try {
    const account = await BoothAccountModelSequelize.findOne({ where: { username } });
    if (!account) return null;
    return account.dataValues as BoothAccountModelType;
  } catch (error) {
    console.error('Error getting booth code by username:', error);
    return null;
  }
}

export const boothAccountUseCase: IBoothAccountUseCase = {
  create,
  getOneByUsername,
  update,
  getBoothCodeByUsername,
}
