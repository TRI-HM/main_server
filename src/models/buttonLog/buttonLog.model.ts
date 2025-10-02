import { DataTypes } from "sequelize";
import SequelizeDB from "../../database/db";

export const ButtonLogModelSequelize = SequelizeDB.define("button_log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  button1: {
    type: DataTypes.BOOLEAN,
  },
  button2: {
    type: DataTypes.BOOLEAN,
  },
  button3: {
    type: DataTypes.BOOLEAN,
  },
  button4: {
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

type ButtonLogModelType = {
  id: number;
  button1: boolean;
  button2: boolean;
  button3: boolean;
  button4: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

type ButtonLogClientType = Omit<ButtonLogModelType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export { ButtonLogModelType, ButtonLogClientType };
export default ButtonLogModelSequelize;