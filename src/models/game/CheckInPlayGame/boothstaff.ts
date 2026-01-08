'use strict';
import { DataTypes } from "sequelize";
import SequelizeDB from "../../../database/db";
import { v4 as uuidv4 } from 'uuid';

export const BoothStaffModelSequelize = SequelizeDB.define("boothstaffs", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4()
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boothNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: "boothstaffs",
  timestamps: false,
});

export type BoothStaffModelType = {
  id: string;
  username: string;
  password: string;
  boothNumber: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export const BoothStaffUseCase = {
  create: async (boothStaff: Record<any, any>) => {
    return await BoothStaffModelSequelize.create(boothStaff);
  },
  getOne: async (id: string): Promise<BoothStaffModelType | null> => {
    let staff = await BoothStaffModelSequelize.findOne({ where: { id } });
    if (!staff) {
      return null;
    }
    return staff.dataValues as BoothStaffModelType;
  },
  getOneByUsername: async (username: string): Promise<BoothStaffModelType | null> => {
    let staff = await BoothStaffModelSequelize.findOne({ where: { username } });
    if (!staff) {
      return null;
    }
    return staff.dataValues as BoothStaffModelType;
  },
  getAll: async (): Promise<BoothStaffModelType[]> => {
    let staffs = await BoothStaffModelSequelize.findAll();
    return staffs.map(staff => staff.dataValues as BoothStaffModelType);
  },
  update: async (id: string, boothStaffData: Record<any, any>): Promise<boolean> => {
    const [updatedRows] = await BoothStaffModelSequelize.update(boothStaffData, { where: { id } });
    return updatedRows > 0;
  },
  delete: async (id: string): Promise<boolean> => {
    const deletedRows = await BoothStaffModelSequelize.destroy({ where: { id } });
    return deletedRows > 0;
  }
};

