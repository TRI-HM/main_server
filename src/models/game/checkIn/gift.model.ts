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
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quantityRemaining: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
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
  id: number;
  name: string;
  imageUrl: string;
  quantity: number;
  quantityRemaining: number;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type GiftModelClientType = Omit<GiftModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface IGiftUseCase {
  create: (gift: GiftModelClientType) => Promise<GiftModelType | null>;
  getAll: () => Promise<GiftModelType[] | null>;
  update: (id: number, gift: GiftModelClientType) => Promise<GiftModelType | null>;
}

const create = async (gift: GiftModelClientType): Promise<GiftModelType | null> => {
  try {
    let newGift = await GiftModelSequelize.create(gift);
    if (!newGift) return null;
    return newGift.dataValues as GiftModelType;
  } catch (error) {
    console.error('Error creating gift:', error);
    return null;
  }
}

const getAll = async (): Promise<GiftModelType[] | null> => {
  try {
    const gifts = await GiftModelSequelize.findAll();
    if (!gifts) return null;
    return gifts.map(gift => gift.dataValues as GiftModelType);
  } catch (error) {
    console.error('Error getting all gifts:', error);
    return null;
  }
}

const update = async (id: number, gift: GiftModelClientType): Promise<GiftModelType | null> => {
  try {
    let [updatedRows] = await GiftModelSequelize.update(gift, { where: { id } });
    if (!updatedRows) return null;
    return (await GiftModelSequelize.findOne({ where: { id } }))?.dataValues as GiftModelType;
  } catch (error) {
    console.error('Error updating gift:', error);
    return null;
  }
}

export const giftUseCase: IGiftUseCase = {
  create,
  getAll,
  update,
}
