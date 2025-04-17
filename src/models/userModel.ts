import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const UserModelSequelize = SequelizeDB.define("userModel", {
  id: {
    type: DataTypes.STRING,
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