import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const RealEstateApartmentModelSequelize = SequelizeDB.define("real_estate_apartment", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  idStaff: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apartment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
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

export type RealEstateApartmentModelType = {
  id: string;
  idStaff: string;
  block: string;
  floor: string;
  apartment: string;
  location: string;
  status: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type RealEstateApartmentClientType = Omit<RealEstateApartmentModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;