import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const RealEstateStaffModelSequelize = SequelizeDB.define("real_estate_staff", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM('officer', 'sale', 'manager', 'admin'),
    allowNull: false,
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
  },
});

export type RealEstateStaffModelType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: 'officer' | 'sale' | 'manager' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type RealEstateStaffClientType = Omit<RealEstateStaffModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;