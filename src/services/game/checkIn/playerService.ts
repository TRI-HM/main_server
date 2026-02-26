import { CheckInPlayerModelSequelize, PlayerModelType, playerUseCase } from "../../../models/game/checkIn/playerAcc.model";
import validateFields from "../../../util/validateField";
const createPlayer = async (player: PlayerModelType) => {
    let newPlayer = await playerUseCase.create(player);
    if (!newPlayer) return null;
    return newPlayer;
}

const updatePlayer = async (id: number, playerData: Record<any, any>): Promise<PlayerModelType | null> => {
    if (!validateFields(playerData, CheckInPlayerModelSequelize)) {
        return null;
    }
    let updatedPlayerResult = await playerUseCase.update(id, playerData);
    if (!updatedPlayerResult) return null;
    let updatedPlayer = await playerUseCase.getOne(id);
    if (!updatedPlayer) return null;
    return updatedPlayer;
}

const getOnePlayer = async (id: number): Promise<PlayerModelType | null> => {
    let player = await playerUseCase.getOne(id);
    if (!player) return null;
    return player;
}

const getAllPlayers = async (limit: number = 10, cursorId: number = 0): Promise<PlayerModelType[] | null> => {
    let players = await playerUseCase.getMany(limit, cursorId);
    if (!players) return null;
    return players;
}

const deletePlayer = async (id: number): Promise<boolean> => {
    let deletedPlayerResult = await playerUseCase.delete(id);
    if (!deletedPlayerResult) return false;
    return true;
}

const searchByPhoneAndUsername = async (input: string): Promise<PlayerModelType[] | null> => {
    let players = await playerUseCase.searchByPhoneAndUsername(input);
    if (!players) return null;
    return players;
}

const isPlayerExists = async (phone: string): Promise<boolean> => {
    let playerExists = await playerUseCase.isPlayerExists(phone);
    if (!playerExists) return false;
    return true;
}

const getOneByPhoneAndUsername = async (phone: string, username: string): Promise<PlayerModelType | null> => {
    let player = await playerUseCase.getOneByPhoneAndUsername(phone, username);
    if (!player) return null;
    return player;
}

const checkUniqueFieldExists = async (field: string, value: any, excludeId?: number): Promise<PlayerModelType | null> => {
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