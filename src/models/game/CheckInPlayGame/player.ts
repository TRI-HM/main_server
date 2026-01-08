'use strict';
import { Model, Sequelize, DataTypes, Op } from 'sequelize';
import SequelizeDB from '../../../database/db';

export const PlayerModelSequelize = SequelizeDB.define('player', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    played_1: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    played_1_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    played_2: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    played_2_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    played_3: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    played_3_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    played_4: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    played_4_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    played_5: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    played_5_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    redeem: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'players',
    timestamps: false,
  });

export const PlayerDataModelTypeParse = (player: Partial<PlayerModelType> | Record<string, any>): PlayerModelType => {
  const defaultPlayerData: PlayerModelType = {
    id: 0,
    phone: '',
    username: '',
    email: '',
    redeem: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    played_1: 0,
    played_1_at: undefined,
    played_2: 0,
    played_2_at: undefined,
    played_3: 0,
    played_3_at: undefined,
    played_4: 0,
    played_4_at: undefined,
    played_5: 0,
    played_5_at: undefined,
  };
  
  const playerObj = player as Record<string, any>;
  const result: Record<string, any> = { ...defaultPlayerData };
  
  for (const key in playerObj) {
    if (playerObj.hasOwnProperty(key) && key in defaultPlayerData) {
      const value = playerObj[key];
      
      // Xử lý các trường Date (played_X_at)
      if (key.endsWith('_at') && value) {
        result[key] = value instanceof Date ? value : new Date(value);
      }
      // Xử lý các trường khác
      else if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }
  }
  
  return result as PlayerModelType;
}

export type PlayerModelType = {
  id?: number;
  phone?: string;
  username?: string;
  email?: string;
  played_1?: number;
  played_1_at?: Date;
  played_2?: number;
  played_2_at?: Date;
  played_3?: number;
  played_3_at?: Date;
  played_4?: number;
  played_4_at?: Date;
  played_5?: number;
  played_5_at?: Date;
  redeem: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};


export interface IPlayerUseCase {
  create: (player: PlayerModelType) => Promise<PlayerModelType | null>;
  update: (id: number, playerData: Record<any, any>) => Promise<boolean>;
  getOne: (id: number) => Promise<PlayerModelType | null>;
  getMany: (limit: number, cursorId: number) => Promise<PlayerModelType[] | null>;
  delete: (id: number) => Promise<boolean>;
  searchByPhoneAndUsername: (input: string) => Promise<PlayerModelType[] | null>;
  isPlayerExists: (phone: string) => Promise<boolean>;
  getOneByPhoneAndUsername: (phone: string, username: string) => Promise<PlayerModelType | null>;
}


const createPlayer = async (player: PlayerModelType): Promise<PlayerModelType | null> => {
  try {
    const newPlayer = await PlayerModelSequelize.create(player);
    if (!newPlayer) return null;
    return newPlayer.dataValues as PlayerModelType;
  }catch(error) {
    console.error('Error creating player:', error);
    return null;
  }
};

const getOnePlayer = async (id: number): Promise<PlayerModelType | null> => {
  try {
    const player = await PlayerModelSequelize.findOne({ where: { id } });
    if (!player) return null;
    return player.dataValues as PlayerModelType;
  }catch(error) {
    console.error('Error getting player:', error);
    return null;
  }
};

const getMany = async (limit: number, cursorId: number): Promise<PlayerModelType[] | null> => {
  try {
    const players = await PlayerModelSequelize.findAll({
      where: {
        id: {
          [Op.gt]: cursorId || 0
        }
      },
      limit: limit || 10,
      order: [['id', 'ASC']],
    });
    if (!players) return null;
    return players.map(player => player.dataValues as PlayerModelType);
  }catch(error) {
    console.error('Error getting many players:', error);
    return null;
  }
};

const searchByPhoneAndUsername = async (input: string): Promise<PlayerModelType[] | null> => {
  try {
    const players = await PlayerModelSequelize.findAll({ where: { [Op.or]: [
        {phone: { [Op.like]: `${input}%` } }, {username: {[Op.or]: [{ [Op.like]: `${input}%` }, { [Op.like]: `%${input}%` }]} }
      ]}
    });
    if (!players) return null;
    return players.map(player => player.dataValues as PlayerModelType);
  }catch(error) {
    console.error('Error searching by phone:', error);
    return null;
  }
};

const isPlayerExists = async (phone: string): Promise<boolean> => {
  try {
    const player = await PlayerModelSequelize.findOne({ where: { phone } });
    if (!player) return false;
    return true;
  }catch(error) {
    console.error('Error checking if player exists:', error);
    return false;
  }
};

const updatePlayer = async (id: number, playerData: Record<any, any>): Promise<boolean> => {
  try {
    const updatedPlayer = await PlayerModelSequelize.update(playerData, { where: { id } });
    if (!updatedPlayer) return false;
    return true;
  }catch(error) {
    console.error('Error updating player:', error);
    return false;
  }
};

const deletePlayer = async (id: number): Promise<boolean> => {
  try {
    const deletedPlayer = await PlayerModelSequelize.destroy({ where: { id } });
    if (!deletedPlayer) return false;
    return true;
  }catch(error) {
    console.error('Error deleting player:', error);
    return false;
  }
};

const getOneByPhoneAndUsername = async (phone: string, username: string): Promise<PlayerModelType | null> => {
  try {
    const player = await PlayerModelSequelize.findOne({ where: { [Op.or]: [{ phone }, { username }] } });
    if (!player) return null;
    return player.dataValues as PlayerModelType;
  }catch(error) {
    console.error('Error getting player by phone and username:', error);
    return null;
  }
};
export const playerUseCase: IPlayerUseCase = {
  create: createPlayer,
  update: updatePlayer,
  getOne: getOnePlayer,
  getMany: getMany,
  delete: deletePlayer,
  searchByPhoneAndUsername: searchByPhoneAndUsername,
  isPlayerExists: isPlayerExists,
  getOneByPhoneAndUsername: getOneByPhoneAndUsername
}