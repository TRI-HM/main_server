'use strict';
import { DataTypes } from "sequelize";
import SequelizeDB from "../../../database/db";
import { v4 as uuidv4 } from 'uuid';
export const AdminAccountModelSequelize = SequelizeDB.define("adminaccounts", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4()
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "adminaccounts",
  timestamps: false,
}
);

export type AdminAccountModelType = {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export const AdminAccountUseCase = {
  create: async (adminAccount: Record<any, any>) => {
    return await AdminAccountModelSequelize.create(adminAccount);
  },
  getOne: async (id: string): Promise<AdminAccountModelType | null> => {
    let admin = await AdminAccountModelSequelize.findOne({ where: { id } });
    if(!admin){
        return null;
    }
    return admin.dataValues as AdminAccountModelType;
  },
  getOneByUsername: async (username: string): Promise<AdminAccountModelType | null> => {
    let admin = await AdminAccountModelSequelize.findOne({ where: { username } });
    if(!admin){
        return null;
    }
    return admin.dataValues as AdminAccountModelType;
  }
};