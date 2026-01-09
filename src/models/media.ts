import { DataTypes, Op } from "sequelize";
import SequelizeDB from "../database/db";
import path from "path";

export const MediaModelSequelize = SequelizeDB.define("media", {
  "id": {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  "path": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "type": {
    type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
    allowNull: false
  },
  "size": {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  "mimeType": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "extension": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "name": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "createdAt": {
    type: DataTypes.DATE(),
    allowNull: false
  },
  "updatedAt": {
    type: DataTypes.DATE(),
    allowNull: false
  },
  "deletedAt": {
    type: DataTypes.DATE(),
  }
});

export type MediaModelType = {
  id?: number;
  path: string;
  type: string;
  size: number;
  mimeType: string;
  extension: string;
  name: string;
};

interface IMediaUseCase {
    create: (media: MediaModelType) => Promise<MediaModelType | null>;
    update: (id: number, media: MediaModelType) => Promise<boolean>;
    getAll: () => Promise<MediaModelType[] | null>;
    getOne: (id: number) => Promise<MediaModelType | null>;
    delete: (id: number) => Promise<boolean>;
}

const createMedia = async (media: MediaModelType): Promise<MediaModelType | null> => {
    try {
        // Loại bỏ id nếu có để Sequelize tự động tạo
        const { id, ...mediaWithoutId } = media;
        const newMedia = await MediaModelSequelize.create(mediaWithoutId);
        if (!newMedia) return null;
        return newMedia.dataValues as MediaModelType;
    } catch (error) {
        console.error("Error creating media: ", error);
        throw new Error("Failed to create media");
    }
}

const updateMedia = async (id: number, media: MediaModelType): Promise<boolean> => {
    try {
        const updatedMedia = await MediaModelSequelize.update(media, {
            where: { id }
        });
        if (!updatedMedia) return false;
        return true;
    } catch (error) {
        console.error("Error updating media: ", error);
        throw new Error("Failed to update media");
    }
}

const getAllMedia = async (): Promise<MediaModelType[] | null> => {
    try {
        const media = await MediaModelSequelize.findAll();
        if (!media) return null;
        return media.map(media => media.dataValues as MediaModelType);
    } catch (error) {
        console.error("Error getting all media: ", error);
        throw new Error("Failed to get all media");
    }
}

const getOneMedia = async (id: number): Promise<MediaModelType | null> => {
    try {
        const media = await MediaModelSequelize.findOne({ where: { id } });
        if (!media) return null;
        return media.dataValues as MediaModelType;
    } catch (error) {
        console.error("Error getting one media: ", error);
        throw new Error("Failed to get one media");
    }
}

const deleteMedia = async (id: number): Promise<boolean> => {
    try {
        const deletedMedia = await MediaModelSequelize.destroy({ where: { id } });
        if (!deletedMedia) return false;
        return true;
    } catch (error) {
        console.error("Error deleting media: ", error);
        throw new Error("Failed to delete media");
    }
}

const mediaUseCase: IMediaUseCase = {
    create: createMedia,
    update: updateMedia,
    getAll: getAllMedia,
    getOne: getOneMedia,
    delete: deleteMedia,
}

export default mediaUseCase;