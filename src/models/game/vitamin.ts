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
  deletedAt: {
    type: DataTypes.DATE(),
  },
});

export type GameVitaminModelType = {
  id: number;
  win: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GameVitaminClientType = Omit<GameVitaminModelType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface IGameVitaminUseCase {
  create: (win: GameVitaminClientType) => Promise<GameVitaminModelType | null>;
  getOne: (id: number) => Promise<GameVitaminModelType | null>;
  getAll: () => Promise<GameVitaminModelType[] | null>;
}

const create = async (win: GameVitaminClientType): Promise<GameVitaminModelType | null> => {
  const newRow = await GameVitaminModelSequelize.create(win);
  if (!newRow) return null;
  return newRow.dataValues as GameVitaminModelType;
}

const getOne = async (id: number): Promise<GameVitaminModelType | null> => {
  try {
    console.log("Fetching row with ID: ", id);
    const row = await GameVitaminModelSequelize.findByPk(id);
    console.log("Row found: ", row);
    if (!row) return null;
    return row.dataValues as GameVitaminModelType;
  } catch (error) {
    console.error("❌ Error when fetching vitamin:", error);
    throw error;
  }
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