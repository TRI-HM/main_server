import { DataType, DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const RealEstateViewsModelSequelize = SequelizeDB.define("real_estate_views", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  apartmentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
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

export type RealEstateViewsModelType = {
  id: string;
  apartmentId: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type RealEstateViewsClientType = Omit<RealEstateViewsModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;