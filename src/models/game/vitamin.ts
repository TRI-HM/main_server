import { DataTypes } from "sequelize";
import SequelizeDB from "../../database/db";

export const GameVitaminModelSequelize = SequelizeDB.define("vitamin", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  win: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE(),
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE(),
    allowNull: false
  },
});

export type GameVitaminModelType = {
  id: number;
  win: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GameVitaminClientType = Omit<GameVitaminModelType, 'id' | 'createdAt' | 'updatedAt'>;

export interface IGameVitaminUseCase {
  create: (win: GameVitaminClientType) => Promise<GameVitaminModelType | null>;
  getOne: (id: string) => Promise<GameVitaminModelType | null>;
  getAll: () => Promise<GameVitaminModelType[] | null>;
}

const create = async (win: GameVitaminClientType): Promise<GameVitaminModelType | null> => {
  const newRow = await GameVitaminModelSequelize.create(win);
  if (!newRow) return null;
  return newRow.dataValues as GameVitaminModelType;
}

const getOne = async (id: string): Promise<GameVitaminModelType | null> => {
  const row = await GameVitaminModelSequelize.findOne({ where: { id } });
  if (!row) return null;
  return row.dataValues as GameVitaminModelType;
}

const getAll = async (): Promise<GameVitaminModelType[] | null> => {
  const table = await GameVitaminModelSequelize.findAll();
  if (!table) return null;
  return table.map(row => row.dataValues as GameVitaminModelType);
}


export const gameVitaminUseCase: IGameVitaminUseCase = {
  create,
  getOne,
  getAll
}