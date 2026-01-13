'use strict';
import { DataTypes } from 'sequelize';
import SequelizeDB from '../../../database/db';
import { v4 as uuidv4 } from 'uuid';

export const CheckInPlayerModelSequelize = SequelizeDB.define('check_in_players', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4(),
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW(),
  },
  updatedAt: {
    type: DataTypes.DATE(),
  },
  deletedAt: {
    type: DataTypes.DATE(),
  },
}, {
});

export type CheckInPlayerModelType = {
  id: string;
  fullName?: string;
  phone: string;
  email: string;
  qrCode: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type CheckInPlayerModelClientType = Omit<CheckInPlayerModelType, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface ICheckInPlayerUseCase {
  create: (player: CheckInPlayerModelClientType) => Promise<CheckInPlayerModelType | null>;
  getOneByPhone: (phone: string) => Promise<CheckInPlayerModelType | null>;
  update?: (id: string, playerData: Partial<CheckInPlayerModelClientType>) => Promise<CheckInPlayerModelType | null>;
  getOne?: (id: string) => Promise<CheckInPlayerModelType | null>;
  getMany?: (limit: number, cursorId: number) => Promise<CheckInPlayerModelType[] | null>;
  delete?: (id: string) => Promise<boolean>;
  searchByPhoneAndUsername?: (input: string) => Promise<CheckInPlayerModelType[] | null>;
  isPlayerExists?: (phone: string) => Promise<boolean>;
  getOneByPhoneAndUsername?: (phone: string, username: string) => Promise<CheckInPlayerModelType | null>;
  checkUniqueFieldExists?: (field: string, value: any, excludeId?: string) => Promise<CheckInPlayerModelType | null>;
}

const create = async (player: CheckInPlayerModelClientType): Promise<CheckInPlayerModelType | null> => {
  try {
    const newPlayer = await CheckInPlayerModelSequelize.create(player);
    if (!newPlayer) return null;
    return newPlayer.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error creating player:', error);
    return null;
  }
};

const getOneByPhone = async (phone: string): Promise<CheckInPlayerModelType | null> => {
  try {
    const player = await CheckInPlayerModelSequelize.findOne({ where: { phone } });
    if (!player) return null;
    return player.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error getting player by phone:', error);
    return null;
  }
};

const update = async (id: string, playerData: Partial<CheckInPlayerModelClientType>): Promise<CheckInPlayerModelType | null> => {
  try {
    const [updatedRows] = await CheckInPlayerModelSequelize.update(playerData, { where: { id } });
    if (!updatedRows) return null;
    const updatedPlayer = await CheckInPlayerModelSequelize.findOne({ where: { id } });
    if (!updatedPlayer) return null;
    return updatedPlayer.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error updating player:', error);
    return null;
  }
};

const getOne = async (id: string): Promise<CheckInPlayerModelType | null> => {
  try {
    const player = await CheckInPlayerModelSequelize.findOne({ where: { id } });
    if (!player) return null;
    return player.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error getting player by id:', error);
    return null;
  }
};

const getMany = async (limit: number = 10, cursorId: number = 0): Promise<CheckInPlayerModelType[] | null> => {
  try {
    const players = await CheckInPlayerModelSequelize.findAll({
      where: {
        id: { [require('sequelize').Op.gt]: cursorId }
      },
      limit: limit,
      order: [['id', 'ASC']]
    });
    if (!players) return null;
    return players.map(player => player.dataValues as CheckInPlayerModelType);
  } catch (error) {
    console.error('Error getting many players:', error);
    return null;
  }
};

const remove = async (id: string): Promise<boolean> => {
  try {
    const deletedRows = await CheckInPlayerModelSequelize.destroy({ where: { id } });
    return deletedRows > 0;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
};

const searchByPhoneAndUsername = async (input: string): Promise<CheckInPlayerModelType[] | null> => {
  try {
    const { Op } = require('sequelize');
    const players = await CheckInPlayerModelSequelize.findAll({
      where: {
        [Op.or]: [
          { phone: { [Op.like]: `%${input}%` } },
          { fullName: { [Op.like]: `%${input}%` } }
        ]
      }
    });
    if (!players) return null;
    return players.map(player => player.dataValues as CheckInPlayerModelType);
  } catch (error) {
    console.error('Error searching players:', error);
    return null;
  }
};

const isPlayerExists = async (phone: string): Promise<boolean> => {
  try {
    const player = await CheckInPlayerModelSequelize.findOne({ where: { phone } });
    return player !== null;
  } catch (error) {
    console.error('Error checking player exists:', error);
    return false;
  }
};

const getOneByPhoneAndUsername = async (phone: string, username: string): Promise<CheckInPlayerModelType | null> => {
  try {
    const player = await CheckInPlayerModelSequelize.findOne({ where: { phone } });
    if (!player) return null;
    return player.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error getting player by phone and username:', error);
    return null;
  }
};

const checkUniqueFieldExists = async (field: string, value: any, excludeId?: string): Promise<CheckInPlayerModelType | null> => {
  try {
    const whereClause: any = { [field]: value };
    if (excludeId) {
      whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }
    const player = await CheckInPlayerModelSequelize.findOne({ where: whereClause });
    if (!player) return null;
    return player.dataValues as CheckInPlayerModelType;
  } catch (error) {
    console.error('Error checking unique field:', error);
    return null;
  }
};

export const checkInPlayerUseCase: ICheckInPlayerUseCase = {
  create,
  getOneByPhone,
  update,
  getOne,
  getMany,
  delete: remove,
  searchByPhoneAndUsername,
  isPlayerExists,
  getOneByPhoneAndUsername,
  checkUniqueFieldExists,
}

// Alias for backward compatibility
export type PlayerModelType = CheckInPlayerModelType;
export const playerUseCase = checkInPlayerUseCase;
