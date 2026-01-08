'use strict';
import { DataTypes } from "sequelize";
import SequelizeDB from "../../../database/db";

export const GiftModelSequelize = SequelizeDB.define("gift", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export type GiftModelType = {
  id?: number;
  name?: string;
  image?: string;
  quantity?: number;
  is_active?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export const GiftUseCase = {
  create: async (gift: Record<string, any>) => {
    return await GiftModelSequelize.create(gift);
  },
  getOne: async (id: number) => {
    return await GiftModelSequelize.findOne({ where: { id } });
  },
  getAll: async () => {
    return await GiftModelSequelize.findAll();
  },
  update: async (id: number, gift: Record<string, any>) => {
    return await GiftModelSequelize.update(gift, { where: { id } });
  },
  filter: async (filter: Record<string, any>) => {
    return await GiftModelSequelize.findAll({ where: filter });
  },
  delete: async (id: number) => {
    return await GiftModelSequelize.destroy({ where: { id } });
  },
};



