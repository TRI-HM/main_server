import validateFields from "../../../util/validateField";
import { PlayerBoothProgressModelSequelize, PlayerBoothProgressModelType, PlayerBoothProgressModelClientType, playerBoothProgressUseCase } from "../../../models/game/checkIn/playerBoothProgress.model";

const createPlayerBoothProgress = async (playerBoothProgress: PlayerBoothProgressModelClientType): Promise<PlayerBoothProgressModelType | null> => {
    if (!validateFields(playerBoothProgress, PlayerBoothProgressModelSequelize)) {
        return null;
    }
    let newPlayerBoothProgress = await playerBoothProgressUseCase.create(playerBoothProgress);
    if (!newPlayerBoothProgress) {
        return null;
    }
    return newPlayerBoothProgress;
}

const getAllByBoothCode = async (boothCode: string): Promise<PlayerBoothProgressModelType[] | null> => {
    let playerBoothProgresses = await playerBoothProgressUseCase.getAllByBoothCode(boothCode);
    if (!playerBoothProgresses || playerBoothProgresses.length === 0) {
        return null;
    }
    return playerBoothProgresses;
}

const getAllByPlayerId = async (playerId: string): Promise<PlayerBoothProgressModelType[] | null> => {
    let playerBoothProgresses = await playerBoothProgressUseCase.getAllByPlayerId(playerId);
    if (!playerBoothProgresses || playerBoothProgresses.length === 0) {
        return null;
    }
    return playerBoothProgresses;
}

export default {
    createPlayerBoothProgress,
    getAllByBoothCode,
    getAllByPlayerId,
};
