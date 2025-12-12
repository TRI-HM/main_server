import { DataType, DataTypes } from "sequelize";
import SequelizeDB from "../database/db";

export const VideoModelSequelize = SequelizeDB.define("video", {
  file_name: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_enabled: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE(),
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
}, {
  tableName: 'videos', // Khớp với tên bảng trong database (Sequelize sẽ tự động lowercase)
  timestamps: false, // Tắt timestamps tự động vì đã có created_at, updated_at
  underscored: false,
});

export type VideoModelType = {
  file_name: string;
  file_path: string;
  phone?: string;
  is_enabled: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

export interface IVideoUsecase {
    create: (video: VideoClientType) => Promise<VideoModelType | null>;
}


export type VideoClientType = Omit<VideoModelType, 'created_at' | 'updated_at' | 'deleted_at'>;