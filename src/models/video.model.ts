import { DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const VideoModelSequelize = SequelizeDB.define("video", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: `Theon-${Date.now()}`,
  },
  phone: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("confirmed", "rejected", "pending"),
    defaultValue: "pending",
  },
  note: {
    type: DataTypes.STRING,
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
})

export type VideoModelType = {
  id: string;
  name: string;
  phone: string;
  description: string;
  filePath: string;
  isEnabled: boolean;
  status: "confirmed" | "rejected" | "pending";
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};


export type VideoClientType = Omit<VideoModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;