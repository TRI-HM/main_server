'use strict';
import { DataTypes } from 'sequelize';
import SequelizeDB from '../../../database/db';

export const BoothModelSequelize = SequelizeDB.define('booths', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    boothCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    boothName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    areaCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE(),
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE(),
        allowNull: false,
    },
    deletedAt: {
        type: DataTypes.DATE(),
    },
});

export type BoothModelType = {
    id: number;
    boothCode: string;
    boothName: string;
    areaCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
};

export type BoothModelClientType = Omit<BoothModelType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface IBoothUseCase {
    create: (booth: BoothModelClientType) => Promise<BoothModelType | null>;
    getOneByCode: (code: string) => Promise<BoothModelType | null>;
    getAll: () => Promise<BoothModelType[] | null>;
    update: (code: string, booth: BoothModelClientType) => Promise<BoothModelType | null>;
    delete: (code: string) => Promise<boolean>;
}

const create = async (booth: BoothModelClientType): Promise<BoothModelType | null> => {
    try {
        const newBooth = await BoothModelSequelize.create(booth);
        if (!newBooth) return null;
        return newBooth.dataValues as BoothModelType;
    } catch (error) {
        console.error('Error creating booth:', error);
        return null;
    }
}

const getOneByCode = async (code: string): Promise<BoothModelType | null> => {
    try {
        const booth = await BoothModelSequelize.findOne({ where: { boothCode: code } });
        if (!booth) return null;
        return booth.dataValues as BoothModelType;
    } catch (error) {
        console.error('Error getting booth by code:', error);
        return null;
    }
}

const getAll = async (): Promise<BoothModelType[] | null> => {
    try {
        const booths = await BoothModelSequelize.findAll();
        if (!booths) return null;
        return booths.map(booth => booth.dataValues as BoothModelType);
    } catch (error) {
        console.error('Error getting all booths:', error);
        return null;
    }
}

const update = async (code: string, booth: BoothModelClientType): Promise<BoothModelType | null> => {
    try {
        const [updatedRows] = await BoothModelSequelize.update(booth, { where: { boothCode: code } });
        if (!updatedRows) return null;
        return await getOneByCode(code);
    } catch (error) {
        console.error('Error updating booth:', error);
        throw new Error('Failed to update booth');
    }
}

const remove = async (code: string): Promise<boolean> => {
    try {
        const deletedRows = await BoothModelSequelize.destroy({ where: { boothCode: code } });
        return deletedRows > 0;
    } catch (error) {
        console.error('Error deleting booth:', error);
        throw new Error('Failed to delete booth');
    }
}

export const boothUseCase: IBoothUseCase = {
    create,
    getOneByCode,
    getAll,
    update,
    delete: remove,
}