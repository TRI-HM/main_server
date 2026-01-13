import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import playerService from "../../../services/game/checkIn/player.service";
import boothService from "../../../services/game/checkIn/booths.service";
import boothAccountService from "../../../services/game/checkIn/boothAccount.service";
import giftService from "../../../services/game/checkIn/giftService";
import playerBoothProgressService from "../../../services/game/checkIn/playerBoothProgress.service";
import { CheckInPlayerModelClientType } from "../../../models/game/checkIn/playerAcc.model";
import { BoothModelClientType } from "../../../models/game/checkIn/booths.model";
import { BoothAccountModelClientType } from "../../../models/game/checkIn/boothAcc.model";
import { GiftModelClientType } from "../../../models/game/checkIn/gift.model";
import { PlayerBoothProgressModelClientType } from "../../../models/game/checkIn/playerBoothProgress.model";

// ==================== Player Controllers ====================
export const createPlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const player: CheckInPlayerModelClientType = req.body;
        console.log("Player: ", player);
        let newPlayer = await playerService.createPlayer(player);
        if (!newPlayer) {
            res.status(400).json({ message: "Failed to create player" });
            return;
        }
        res.status(200).json({ message: "Player created successfully", data: newPlayer });
    } catch (error) {
        res.status(500).json({ message: "Failed to create player", error: error });
    }
});

export const updatePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const playerData: Record<any, any> = req.body;
        let updatedPlayer = await playerService.updatePlayer(id, playerData);
        if (!updatedPlayer) {
            res.status(400).json({ message: "Failed to update player" });
            return;
        }
        res.status(200).json({ message: "Player updated successfully", data: updatedPlayer });
    } catch (error) {
        res.status(500).json({ message: "Failed to update player", error: error });
    }
});

export const getOnePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        let player = await playerService.getOnePlayer(id);
        if (!player) {
            res.status(404).json({ message: "Player not found" });
            return;
        }
        res.status(200).json({ message: "Player found", data: player });
    } catch (error) {
        res.status(500).json({ message: "Failed to get player", error: error });
    }
});

export const getAllPlayers = wrapAsync(async (req: Request, res: Response) => {
    try {
        const limit: number = parseInt(req.query.limit as string) || 10;
        const cursorId: number = parseInt(req.query.cursorId as string) || 0;
        let players = await playerService.getAllPlayers(limit, cursorId);
        if (!players) {
            res.status(404).json({ message: "No players found" });
            return;
        }
        res.status(200).json({ message: "Players retrieved successfully", data: players });
    } catch (error) {
        res.status(500).json({ message: "Failed to get players", error: error });
    }
});

export const deletePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        let deleted = await playerService.deletePlayer(id);
        if (!deleted) {
            res.status(400).json({ message: "Failed to delete player" });
            return;
        }
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete player", error: error });
    }
});

export const searchPlayers = wrapAsync(async (req: Request, res: Response) => {
    try {
        const input: string = req.query.input as string;
        if (!input) {
            res.status(400).json({ message: "Search input is required" });
            return;
        }
        let players = await playerService.searchByPhoneAndUsername(input);
        if (!players) {
            res.status(404).json({ message: "No players found" });
            return;
        }
        res.status(200).json({ message: "Players found", data: players });
    } catch (error) {
        res.status(500).json({ message: "Failed to search players", error: error });
    }
});

export const checkPlayerExists = wrapAsync(async (req: Request, res: Response) => {
    try {
        const phone: string = req.query.phone as string;
        if (!phone) {
            res.status(400).json({ message: "Phone is required" });
            return;
        }
        let exists = await playerService.isPlayerExists(phone);
        res.status(200).json({ message: "Check completed", exists: exists });
    } catch (error) {
        res.status(500).json({ message: "Failed to check player", error: error });
    }
});

// ==================== Booth Controllers ====================
export const createBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const booth: BoothModelClientType = req.body;
        let newBooth = await boothService.createBooth(booth);
        if (!newBooth) {
            res.status(400).json({ message: "Failed to create booth" });
            return;
        }
        res.status(200).json({ message: "Booth created successfully", data: newBooth });
    } catch (error) {
        res.status(500).json({ message: "Failed to create booth", error: error });
    }
});

export const updateBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        const booth: BoothModelClientType = req.body;
        let updatedBooth = await boothService.updateBooth(boothCode, booth);
        if (!updatedBooth) {
            res.status(400).json({ message: "Failed to update booth" });
            return;
        }
        res.status(200).json({ message: "Booth updated successfully", data: updatedBooth });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booth", error: error });
    }
});

export const getOneBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let booth = await boothService.getOneBooth(boothCode);
        if (!booth) {
            res.status(404).json({ message: "Booth not found" });
            return;
        }
        res.status(200).json({ message: "Booth found", data: booth });
    } catch (error) {
        res.status(500).json({ message: "Failed to get booth", error: error });
    }
});

export const getAllBooths = wrapAsync(async (req: Request, res: Response) => {
    try {
        let booths = await boothService.getAllBooths();
        if (!booths) {
            res.status(404).json({ message: "No booths found" });
            return;
        }
        res.status(200).json({ message: "Booths retrieved successfully", data: booths });
    } catch (error) {
        res.status(500).json({ message: "Failed to get booths", error: error });
    }
});

export const deleteBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let deleted = await boothService.deleteBooth(boothCode);
        if (!deleted) {
            res.status(400).json({ message: "Failed to delete booth" });
            return;
        }
        res.status(200).json({ message: "Booth deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booth", error: error });
    }
});

// ==================== Booth Account Controllers ====================
export const createBoothAccount = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothAccount: BoothAccountModelClientType = req.body;
        let newBoothAccount = await boothAccountService.createBoothAccount(boothAccount);
        if (!newBoothAccount) {
            res.status(400).json({ message: "Failed to create booth account" });
            return;
        }
        res.status(200).json({ message: "Booth account created successfully", data: newBoothAccount });
    } catch (error) {
        res.status(500).json({ message: "Failed to create booth account", error: error });
    }
});

export const updateBoothAccount = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const boothAccount: BoothAccountModelClientType = req.body;
        let updatedBoothAccount = await boothAccountService.updateBoothAccount(id, boothAccount);
        if (!updatedBoothAccount) {
            res.status(400).json({ message: "Failed to update booth account" });
            return;
        }
        res.status(200).json({ message: "Booth account updated successfully", data: updatedBoothAccount });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booth account", error: error });
    }
});

export const getBoothAccountByUsername = wrapAsync(async (req: Request, res: Response) => {
    try {
        const username: string = req.params.username;
        let boothAccount = await boothAccountService.getOneByUsername(username);
        if (!boothAccount) {
            res.status(404).json({ message: "Booth account not found" });
            return;
        }
        res.status(200).json({ message: "Booth account found", data: boothAccount });
    } catch (error) {
        res.status(500).json({ message: "Failed to get booth account", error: error });
    }
});

// ==================== Gift Controllers ====================
export const createGift = wrapAsync(async (req: Request, res: Response) => {
    try {
        const gift: GiftModelClientType = req.body;
        let newGift = await giftService.createGift(gift);
        if (!newGift) {
            res.status(400).json({ message: "Failed to create gift" });
            return;
        }
        res.status(200).json({ message: "Gift created successfully", data: newGift });
    } catch (error) {
        res.status(500).json({ message: "Failed to create gift", error: error });
    }
});

export const updateGift = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const gift: GiftModelClientType = req.body;
        let updatedGift = await giftService.updateGift(id, gift);
        if (!updatedGift) {
            res.status(400).json({ message: "Failed to update gift" });
            return;
        }
        res.status(200).json({ message: "Gift updated successfully", data: updatedGift });
    } catch (error) {
        res.status(500).json({ message: "Failed to update gift", error: error });
    }
});

export const getAllGifts = wrapAsync(async (req: Request, res: Response) => {
    try {
        let gifts = await giftService.getAllGifts();
        if (!gifts) {
            res.status(404).json({ message: "No gifts found" });
            return;
        }
        res.status(200).json({ message: "Gifts retrieved successfully", data: gifts });
    } catch (error) {
        res.status(500).json({ message: "Failed to get gifts", error: error });
    }
});

// ==================== Player Booth Progress Controllers ====================
export const createPlayerBoothProgress = wrapAsync(async (req: Request, res: Response) => {
    try {
        const playerBoothProgress: PlayerBoothProgressModelClientType = req.body;
        let newPlayerBoothProgress = await playerBoothProgressService.createPlayerBoothProgress(playerBoothProgress);
        if (!newPlayerBoothProgress) {
            res.status(400).json({ message: "Failed to create player booth progress" });
            return;
        }
        res.status(200).json({ message: "Player booth progress created successfully", data: newPlayerBoothProgress });
    } catch (error) {
        res.status(500).json({ message: "Failed to create player booth progress", error: error });
    }
});

export const getPlayerBoothProgressByBoothCode = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let playerBoothProgresses = await playerBoothProgressService.getAllByBoothCode(boothCode);
        if (!playerBoothProgresses) {
            res.status(404).json({ message: "No player booth progress found" });
            return;
        }
        res.status(200).json({ message: "Player booth progress retrieved successfully", data: playerBoothProgresses });
    } catch (error) {
        res.status(500).json({ message: "Failed to get player booth progress", error: error });
    }
});

export const getPlayerBoothProgressByPlayerId = wrapAsync(async (req: Request, res: Response) => {
    try {
        const playerId: string = req.params.playerId;
        let playerBoothProgresses = await playerBoothProgressService.getAllByPlayerId(playerId);
        if (!playerBoothProgresses) {
            res.status(404).json({ message: "No player booth progress found" });
            return;
        }
        res.status(200).json({ message: "Player booth progress retrieved successfully", data: playerBoothProgresses });
    } catch (error) {
        res.status(500).json({ message: "Failed to get player booth progress", error: error });
    }
});

const checkInController = {
    // Player
    createPlayer,
    updatePlayer,
    getOnePlayer,
    getAllPlayers,
    deletePlayer,
    searchPlayers,
    checkPlayerExists,
    // Booth
    createBooth,
    updateBooth,
    getOneBooth,
    getAllBooths,
    deleteBooth,
    // Booth Account
    createBoothAccount,
    updateBoothAccount,
    getBoothAccountByUsername,
    // Gift
    createGift,
    updateGift,
    getAllGifts,
    // Player Booth Progress
    createPlayerBoothProgress,
    getPlayerBoothProgressByBoothCode,
    getPlayerBoothProgressByPlayerId,
};

export default checkInController;
