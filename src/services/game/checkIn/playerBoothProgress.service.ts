import validateFields from "../../../util/validateField";
import { PlayerBoothProgressModelSequelize, PlayerBoothProgressModelType, PlayerBoothProgressModelClientType, playerBoothProgressUseCase } from "../../../models/game/checkIn/playerBoothProgress.model";
import { playerUseCase } from "../../../models/game/checkIn/playerAcc.model";
import boothAccountService from "./boothAccount.service";
import playerService from "./player.service";

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

const createPlayerBoothProgressWithBoothAccountAndPhoneNumber = async (boothAccount: string, phoneNumber: string): Promise<PlayerBoothProgressModelType | null> => {
    try {
        // Get boothCode by username
        let boothAccountData = await boothAccountService.getBoothCodeByUsername(boothAccount);
        if (!boothAccountData) throw new Error('Booth account not found');
        let boothCode = boothAccountData.boothCode as string;
        let boothAccountId = boothAccountData.id as number;
        // Get player by phone number
        let player = await playerService.searchByPhoneAndUsername(phoneNumber);
        if (!player || player.length === 0) throw new Error('Player not found');
        let playerId = player[0].id as string;
        // Create player booth progress
        let newPlayerBoothProgress = await playerBoothProgressUseCase.create({ playerId, boothCode, verifiedByAccountId: boothAccountId, verifiedAt: new Date() });
        if (!newPlayerBoothProgress) throw new Error('Failed to create player booth progress');
        return newPlayerBoothProgress;
    } catch (error) {
        console.error('Error creating player booth progress with booth account and phone number:', error);
        return null;
    }
}

const playerBoothProgressService = {
    createPlayerBoothProgress,
    getAllByBoothCode,
    getAllByPlayerId,
    createPlayerBoothProgressWithBoothAccountAndPhoneNumber
};

export default playerBoothProgressService;
