import { Router } from "express";
import checkInController from "./controller";

const router = Router();

//zalo
router.post("/getOTP", checkInController.getOTP);
router.post("/verifyOTP", checkInController.verifyOTP);

// ==================== Player Routes ====================
router.post("/player/create", checkInController.createPlayer); // POST /api/game/check-in/player/create
router.patch("/player/update/:id", checkInController.updatePlayer); // PATCH /api/game/check-in/player/update/:id
router.get("/player/get/:id", checkInController.getOnePlayer); // GET /api/game/check-in/player/get/:id
router.get("/player/getAll", checkInController.getAllPlayers); // GET /api/game/check-in/player/getAll?limit=10&cursorId=0
router.delete("/player/delete/:id", checkInController.deletePlayer); // DELETE /api/game/check-in/player/delete/:id
router.get("/player/search", checkInController.searchPlayers); // GET /api/game/check-in/player/search?input=...
router.get("/player/checkExists", checkInController.checkPlayerExists); // GET /api/game/check-in/player/checkExists?phone=...

// ==================== Booth Routes ====================
router.post("/booth/create", checkInController.createBooth); // POST /api/game/check-in/booth/create
router.patch("/booth/update/:boothCode", checkInController.updateBooth); // PATCH /api/game/check-in/booth/update/:boothCode
router.get("/booth/get/:boothCode", checkInController.getOneBooth); // GET /api/game/check-in/booth/get/:boothCode
router.get("/booth/getAll", checkInController.getAllBooths); // GET /api/game/check-in/booth/getAll
router.delete("/booth/delete/:boothCode", checkInController.deleteBooth); // DELETE /api/game/check-in/booth/delete/:boothCode

// ==================== Booth Account Routes ====================
router.post("/booth-account/create", checkInController.createBoothAccount); // POST /api/game/check-in/booth-account/create
router.patch("/booth-account/update/:id", checkInController.updateBoothAccount); // PATCH /api/game/check-in/booth-account/update/:id
router.get("/booth-account/get/:username", checkInController.getBoothAccountByUsername); // GET /api/game/check-in/booth-account/get/:username
router.get("/booth-account/getAll", checkInController.getAllBoothAccounts); // GET /api/game/check-in/booth-account/getAll
router.get("/booth-account/getAllActive", checkInController.getAllActiveBoothAccounts); // GET /api/game/check-in/booth-account/getAllActive
router.post("/booth-account/login", checkInController.loginBoothAccount); // POST /api/game/check-in/booth-account/login

// ==================== Gift Routes ====================
router.post("/gift/create", checkInController.createGift); // POST /api/game/check-in/gift/create
router.patch("/gift/update/:id", checkInController.updateGift); // PATCH /api/game/check-in/gift/update/:id
router.get("/gift/getAll", checkInController.getAllGifts); // GET /api/game/check-in/gift/getAll

// ==================== Player Booth Progress Routes ====================
router.post("/player-booth-progress/create", checkInController.createPlayerBoothProgress); // POST /api/game/check-in/player-booth-progress/create
router.post("/player-booth-progress/create/:boothAccount/:phoneNumber", checkInController.createPlayerBoothProgressWithBoothAccountAndPhoneNumber); // POST /api/game/check-in/player-booth-progress/create/:boothAccount/:phoneNumber
router.get("/player-booth-progress/booth/:boothCode", checkInController.getPlayerBoothProgressByBoothCode); // GET /api/game/check-in/player-booth-progress/booth/:boothCode
router.get("/player-booth-progress/player/:playerId", checkInController.getPlayerBoothProgressByPlayerId); // GET /api/game/check-in/player-booth-progress/player/:playerId

export default router;
