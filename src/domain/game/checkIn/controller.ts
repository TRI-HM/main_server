import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import ioCustom from "../../../util/ioCustom";
import playerService from "../../../services/game/checkIn/player.service";
import boothService from "../../../services/game/checkIn/booths.service";
import boothAccountService from "../../../services/game/checkIn/boothAccount.service";
import giftService from "../../../services/game/checkIn/giftService";
import { CheckInPlayerModelClientType } from "../../../models/game/checkIn/playerAcc.model";
import { BoothModelClientType } from "../../../models/game/checkIn/booths.model";
import { BoothAccountModelClientType } from "../../../models/game/checkIn/boothAcc.model";
import { GiftModelClientType } from "../../../models/game/checkIn/gift.model";
import { PlayerBoothProgressModelClientType } from "../../../models/game/checkIn/playerBoothProgress.model";
import playerBoothProgressService from "../../../services/game/checkIn/playerBoothProgress.service";

// ==================== Player Controllers ====================
export const createPlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const player: CheckInPlayerModelClientType = req.body;
        let newPlayer = await playerService.createPlayer(player);
        if (!newPlayer) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create player" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player created successfully", newPlayer));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create player" }, error));
    }
});

export const updatePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const playerData: Record<any, any> = req.body;
        let updatedPlayer = await playerService.updatePlayer(id, playerData);
        if (!updatedPlayer) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to update player" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player updated successfully", updatedPlayer));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to update player" }, error));
    }
});

export const getOnePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        let player = await playerService.getOnePlayer(id);
        if (!player) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "Player not found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player found", player));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get player" }, error));
    }
});

export const getAllPlayers = wrapAsync(async (req: Request, res: Response) => {
    try {
        const limit: number = parseInt(req.query.limit as string) || 10;
        const cursorId: number = parseInt(req.query.cursorId as string) || 0;
        let players = await playerService.getAllPlayers(limit, cursorId);
        if (!players) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No players found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Players retrieved successfully", players));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get players" }, error));
    }
});

export const deletePlayer = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        let deleted = await playerService.deletePlayer(id);
        if (!deleted) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to delete player" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player deleted successfully"));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to delete player" }, error));
    }
});

export const searchPlayers = wrapAsync(async (req: Request, res: Response) => {
    try {
        const input: string = req.query.input as string;
        if (!input) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Search input is required" }));
            return;
        }
        let players = await playerService.searchByPhoneAndUsername(input);
        if (!players) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No players found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Players found", players));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to search players" }, error));
    }
});

export const checkPlayerExists = wrapAsync(async (req: Request, res: Response) => {
    try {
        const phone: string = req.query.phone as string;
        if (!phone) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Phone is required" }));
            return;
        }
        let exists = await playerService.isPlayerExists(phone);
        res.status(200).json(ioCustom.toResponse(200, "Check completed", { exists }));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to check player" }, error));
    }
});

// ==================== Booth Controllers ====================
export const createBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const booth: BoothModelClientType = req.body;
        let newBooth = await boothService.createBooth(booth);
        if (!newBooth) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create booth" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth created successfully", newBooth));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create booth" }, error));
    }
});

export const updateBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        const booth: BoothModelClientType = req.body;
        let updatedBooth = await boothService.updateBooth(boothCode, booth);
        if (!updatedBooth) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to update booth" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth updated successfully", updatedBooth));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to update booth" }, error));
    }
});

export const getOneBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let booth = await boothService.getOneBooth(boothCode);
        if (!booth) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "Booth not found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth found", booth));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get booth" }, error));
    }
});

export const getAllBooths = wrapAsync(async (req: Request, res: Response) => {
    try {
        let booths = await boothService.getAllBooths();
        if (!booths) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No booths found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booths retrieved successfully", booths));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get booths" }, error));
    }
});

export const deleteBooth = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let deleted = await boothService.deleteBooth(boothCode);
        if (!deleted) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to delete booth" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth deleted successfully"));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to delete booth" }, error));
    }
});

// ==================== Booth Account Controllers ====================
export const createBoothAccount = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothAccount: BoothAccountModelClientType = req.body;
        let newBoothAccount = await boothAccountService.create(boothAccount);
        if (!newBoothAccount) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create booth account" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth account created successfully", newBoothAccount));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create booth account" }, error));
    }
});

export const updateBoothAccount = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const boothAccount: BoothAccountModelClientType = req.body;
        let updatedBoothAccount = await boothAccountService.update(id, boothAccount);
        if (!updatedBoothAccount) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to update booth account" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth account updated successfully", updatedBoothAccount));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to update booth account" }, error));
    }
});

export const getBoothAccountByUsername = wrapAsync(async (req: Request, res: Response) => {
    try {
        const username: string = req.params.username;
        let boothAccount = await boothAccountService.getOneByUsername(username);
        if (!boothAccount) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "Booth account not found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth account found", boothAccount));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get booth account" }, error));
    }
});

export const getAllBoothAccounts = wrapAsync(async (req: Request, res: Response) => {
    try {
        let boothAccounts = await boothAccountService.getAll();
        if (!boothAccounts) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No booth accounts found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth accounts retrieved successfully", boothAccounts));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get booth accounts" }, error));
    }
});

export const getAllActiveBoothAccounts = wrapAsync(async (req: Request, res: Response) => {
    try {
        let boothAccounts = await boothAccountService.getAllActive();
        if (!boothAccounts) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No active booth accounts found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Active booth accounts retrieved successfully", boothAccounts));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get active booth accounts" }, error));
    }
});

// ==================== Gift Controllers ====================
export const createGift = wrapAsync(async (req: Request, res: Response) => {
    try {
        const gift: GiftModelClientType = req.body;
        let newGift = await giftService.createGift(gift);
        if (!newGift) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create gift" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Gift created successfully", newGift));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create gift" }, error));
    }
});

export const updateGift = wrapAsync(async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const gift: GiftModelClientType = req.body;
        let updatedGift = await giftService.updateGift(id, gift);
        if (!updatedGift) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to update gift" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Gift updated successfully", updatedGift));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to update gift" }, error));
    }
});

export const getAllGifts = wrapAsync(async (req: Request, res: Response) => {
    try {
        let gifts = await giftService.getAllGifts();
        if (!gifts) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No gifts found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Gifts retrieved successfully", gifts));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get gifts" }, error));
    }
});

// ==================== Player Booth Progress Controllers ====================
export const createPlayerBoothProgress = wrapAsync(async (req: Request, res: Response) => {
    try {
        const playerBoothProgress: PlayerBoothProgressModelClientType = req.body;
        let newPlayerBoothProgress = await playerBoothProgressService.createPlayerBoothProgress(playerBoothProgress);
        if (!newPlayerBoothProgress) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create player booth progress" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player booth progress created successfully", newPlayerBoothProgress));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create player booth progress" }, error));
    }
});

export const getPlayerBoothProgressByBoothCode = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothCode: string = req.params.boothCode;
        let playerBoothProgresses = await playerBoothProgressService.getAllByBoothCode(boothCode);
        if (!playerBoothProgresses) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No player booth progress found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player booth progress retrieved successfully", playerBoothProgresses));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get player booth progress" }, error));
    }
});

export const getPlayerBoothProgressByPlayerId = wrapAsync(async (req: Request, res: Response) => {
    try {
        const playerId: string = req.params.playerId;
        let playerBoothProgresses = await playerBoothProgressService.getAllByPlayerId(playerId);
        if (!playerBoothProgresses) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "No player booth progress found" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player booth progress retrieved successfully", playerBoothProgresses));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to get player booth progress" }, error));
    }
});

export const createPlayerBoothProgressWithBoothAccountAndPhoneNumber = wrapAsync(async (req: Request, res: Response) => {
    try {
        const boothAccount: string = req.params.boothAccount;
        const phoneNumber: string = req.params.phoneNumber;
        if (!boothAccount || !phoneNumber) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Booth account and phone number are required" }));
            return;
        }
        let newPlayerBoothProgress = await playerBoothProgressService.createPlayerBoothProgressWithBoothAccountAndPhoneNumber(boothAccount, phoneNumber);
        if (!newPlayerBoothProgress) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Failed to create player booth progress with booth account and phone number" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Player booth progress created successfully with booth account and phone number", newPlayerBoothProgress));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to create player booth progress with booth account and phone number" }, error));
    }
});

export const loginBoothAccount = wrapAsync(async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const password: string = req.body.password;
        if (!username || !password) {
            res.status(400).json(ioCustom.toResponseError({ code: 400, message: "Username and password are required" }));
            return;
        }
        console.log("username", username);
        console.log("password", password);
        let boothAccount = await boothAccountService.login(username, password);
        if (!boothAccount) {
            res.status(404).json(ioCustom.toResponseError({ code: 404, message: "Invalid username or password" }));
            return;
        }
        res.status(200).json(ioCustom.toResponse(200, "Booth account logged in successfully", true));
    } catch (error) {
        res.status(500).json(ioCustom.toResponseError({ code: 500, message: "Failed to login booth account" }, error));
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
    getAllBoothAccounts,
    getAllActiveBoothAccounts,
    loginBoothAccount,
    // Gift
    createGift,
    updateGift,
    getAllGifts,
    // Player Booth Progress
    createPlayerBoothProgress,
    createPlayerBoothProgressWithBoothAccountAndPhoneNumber,
    getPlayerBoothProgressByBoothCode,
    getPlayerBoothProgressByPlayerId,
};

export default checkInController;
