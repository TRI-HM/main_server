import { CheckInPlayerModelSequelize, PlayerModelType, CheckInPlayerModelClientType, playerUseCase } from "../../../models/game/checkIn/playerAcc.model";
import validateFields from "../../../util/validateField";
const createPlayer = async (player: CheckInPlayerModelClientType) => {
    let newPlayer = await playerUseCase.create(player);
    if (!newPlayer) return null;
    return newPlayer;
}

const updatePlayer = async (id: string, playerData: Record<any, any>): Promise<PlayerModelType | null> => {
    if (!validateFields(playerData, CheckInPlayerModelSequelize)) {
        return null;
    }
    if (!playerUseCase.update) return null;
    let updatedPlayerResult = await playerUseCase.update(id, playerData);
    if (!updatedPlayerResult) return null;
    if (!playerUseCase.getOne) return null;
    let updatedPlayer = await playerUseCase.getOne(id);
    if (!updatedPlayer) return null;
    return updatedPlayer;
}

const getOnePlayer = async (id: string): Promise<PlayerModelType | null> => {
    if (!playerUseCase.getOne) return null;
    let player = await playerUseCase.getOne(id);
    if (!player) return null;
    return player;
}

const getAllPlayers = async (limit: number = 10, cursorId: number = 0): Promise<PlayerModelType[] | null> => {
    if (!playerUseCase.getMany) return null;
    let players = await playerUseCase.getMany(limit, cursorId);
    if (!players) return null;
    return players;
}

const deletePlayer = async (id: string): Promise<boolean> => {
    if (!playerUseCase.delete) return false;
    let deletedPlayerResult = await playerUseCase.delete(id);
    if (!deletedPlayerResult) return false;
    return true;
}

const searchByPhoneAndUsername = async (input: string): Promise<PlayerModelType[] | null> => {
    if (!playerUseCase.searchByPhoneAndUsername) return null;
    let players = await playerUseCase.searchByPhoneAndUsername(input);
    if (!players) return null;
    return players;
}

const isPlayerExists = async (phone: string): Promise<boolean> => {
    if (!playerUseCase.isPlayerExists) {
        // Fallback to getOneByPhone
        let player = await playerUseCase.getOneByPhone(phone);
        return player !== null;
    }
    let playerExists = await playerUseCase.isPlayerExists(phone);
    if (!playerExists) return false;
    return true;
}

const getOneByPhoneAndUsername = async (phone: string, username: string): Promise<PlayerModelType | null> => {
    if (!playerUseCase.getOneByPhoneAndUsername) {
        // Fallback to getOneByPhone
        return await playerUseCase.getOneByPhone(phone);
    }
    let player = await playerUseCase.getOneByPhoneAndUsername(phone, username);
    if (!player) return null;
    return player;
}

const checkUniqueFieldExists = async (field: string, value: any, excludeId?: string): Promise<PlayerModelType | null> => {
    if (!playerUseCase.checkUniqueFieldExists) return null;
    let player = await playerUseCase.checkUniqueFieldExists(field, value, excludeId);
    return player;
}

export default {
    createPlayer,
    updatePlayer,
    getOnePlayer,
    getAllPlayers,
    deletePlayer,
    searchByPhoneAndUsername,
    isPlayerExists,
    getOneByPhoneAndUsername,
    checkUniqueFieldExists,
};