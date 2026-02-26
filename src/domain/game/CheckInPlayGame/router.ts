import { Router } from "express";
import CheckInPlayGameController from "./controller";
import GiftController from "./GiftController";
import BoothStaffController from "./BoothStaffController";

const PepsiGameRouter = Router();

PepsiGameRouter.post("/createPlayer", CheckInPlayGameController.createPlayer);
PepsiGameRouter.post("/signin", CheckInPlayGameController.Signin);
PepsiGameRouter.post("/checkInPlayGame", CheckInPlayGameController.checkInPlayGame);
PepsiGameRouter.get("/getPlayerSelf", CheckInPlayGameController.getPlayerSelf);
PepsiGameRouter.post("/adminSignin", CheckInPlayGameController.AdminSignin);
PepsiGameRouter.post("/createAdmin", CheckInPlayGameController.createAdmin);
PepsiGameRouter.get("/getAllPlayers", CheckInPlayGameController.getAllPlayers);
PepsiGameRouter.put("/updatePlayer", CheckInPlayGameController.updatePlayer);
PepsiGameRouter.get("/getGifts", GiftController.getGifts);
PepsiGameRouter.put("/updateGift", GiftController.updateGift);

//zalo
PepsiGameRouter.post("/getOTP", CheckInPlayGameController.getOTP);
PepsiGameRouter.post("/verifyOTP", CheckInPlayGameController.verifyOTP);

// Booth Staff routes
PepsiGameRouter.post("/boothStaff", BoothStaffController.createBoothStaff);
PepsiGameRouter.get("/boothStaff", BoothStaffController.getAllBoothStaffs);
PepsiGameRouter.get("/boothStaff/:id", BoothStaffController.getBoothStaff);
PepsiGameRouter.put("/boothStaff/:id", BoothStaffController.updateBoothStaff);
PepsiGameRouter.delete("/boothStaff/:id", BoothStaffController.deleteBoothStaff);
PepsiGameRouter.post("/boothStaff/signin", BoothStaffController.signinBoothStaff);

export default PepsiGameRouter;