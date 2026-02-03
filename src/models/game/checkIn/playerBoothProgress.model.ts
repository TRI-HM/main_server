'use strict';
import { DataTypes } from "sequelize";
import SequelizeDB from "../../../database/db";
import { BoothModelSequelize } from "./booths.model";
import { CheckInPlayerModelSequelize } from "./playerAcc.model";
import { BoothAccountModelSequelize } from "./boothAcc.model";

export const PlayerBoothProgressModelSequelize = SequelizeDB.define("player_booth_progresses", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    playerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: CheckInPlayerModelSequelize,
            key: 'id'
        }
    },
    boothCode: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: BoothModelSequelize,
            key: 'boothCode'
        }
    },
    verifiedByAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BoothAccountModelSequelize,
            key: 'id'
        }
    },
    verifiedAt: {
        type: DataTypes.DATE(),
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE(),
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE(),
        allowNull: true
    }
});

export type PlayerBoothProgressModelType = {
    id: number;
    playerId: string;
    boothCode: string;
    verifiedByAccountId: number;
    verifiedAt: Date;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
};

export type PlayerBoothProgressModelClientType = Omit<PlayerBoothProgressModelType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface IPlayerBoothProgressUseCase {
    create: (playerBoothProgress: PlayerBoothProgressModelClientType) => Promise<PlayerBoothProgressModelType | null>;
    getAllByBoothCode: (boothCode: string) => Promise<PlayerBoothProgressModelType[] | null>;
    getAllByPlayerId: (playerId: string) => Promise<PlayerBoothProgressModelType[] | null>;
}

const create = async (playerBoothProgress: PlayerBoothProgressModelClientType): Promise<PlayerBoothProgressModelType | null> => {
    try {
        const newPlayerBoothProgress = await PlayerBoothProgressModelSequelize.create(playerBoothProgress);
        if (!newPlayerBoothProgress) return null;
        return newPlayerBoothProgress.dataValues as PlayerBoothProgressModelType;
    } catch (error) {
        console.error('Error creating player booth progress:', error);
        return null;
    }
}

const getAllByBoothCode = async (boothCode: string): Promise<PlayerBoothProgressModelType[] | null> => {
    try {
        const playerBoothProgresses = await PlayerBoothProgressModelSequelize.findAll({ where: { boothCode } });
        if (!playerBoothProgresses) return null;
        return playerBoothProgresses.map(playerBoothProgress => playerBoothProgress.dataValues as PlayerBoothProgressModelType);
    } catch (error) {
        console.error('Error getting player booth progress by booth code:', error);
        return null;
    }
}

const getAllByPlayerId = async (playerId: string): Promise<PlayerBoothProgressModelType[] | null> => {
    try {
        const playerBoothProgresses = await PlayerBoothProgressModelSequelize.findAll({ where: { playerId } });
        if (!playerBoothProgresses) return null;
        return playerBoothProgresses.map(playerBoothProgress => playerBoothProgress.dataValues as PlayerBoothProgressModelType);
    } catch (error) {
        console.error('Error getting player booth progress by player id:', error);
        return null;
    }
}

export const playerBoothProgressUseCase: IPlayerBoothProgressUseCase = {
    create,
    getAllByBoothCode,
    getAllByPlayerId,
}
