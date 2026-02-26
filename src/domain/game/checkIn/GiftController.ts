import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import jwt from "jsonwebtoken";
import adminService from "./checkIn/boothAccount.service";
import giftService from "./checkIn/giftService";

const getGifts = wrapAsync(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    let token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
    }
    let decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
        res.status(400).json({ message: "Invalid token" });
        return;
    }
    let adminId = (decoded as any).adminId;
    if (!adminId) {
        res.status(400).json({ message: "Admin not found" });
        return;
    }
    let admin = await adminService.getOneAdmin(adminId);
    if (!admin) {
        res.status(400).json({ message: "Admin not found" });
        return;
    }
    let gifts = await giftService.getAllGifts();
    if (!gifts) {
        res.status(400).json({ message: "Gifts not found" });
        return;
    }
    res.status(200).json({ message: "Gifts found", data: gifts });
});
const updateGift = wrapAsync(async (req: Request, res: Response) => {
    try {
        let body = req.body;
        const authHeader = req.headers.authorization;
        let token = authHeader?.split(" ")[1];
        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return;
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (!decoded) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        let adminId = (decoded as any).adminId;
        if (!adminId) {
            res.status(400).json({ message: "Admin not found" });
            return;
        }
        let admin = await adminService.getOneAdmin(adminId);
        if (!admin) {
            res.status(400).json({ message: "Admin not found" });
            return;
        }
        let giftId = parseInt(body.giftId);
        let quantity = parseInt(body.quantity);
        if (!giftId || !quantity || quantity < 0) {
            res.status(400).json({ message: "Gift ID is required and quantity must be greater than 0" });
            return;
        }
        let giftData: Record<string, any> = {
            quantity: quantity,
            is_active: quantity > 0 ? true : false,
        }
        let gift = await giftService.updateGift(giftId, giftData);
        if (!gift) {
            res.status(400).json({ message: "Failed to update gift" });
            return;
        }
        res.status(200).json({ message: "Gift updated successfully", data: gift });
    } catch (error) {
        res.status(500).json({ message: "Failed to update gift", error: error });
    }
});

const GiftController = {
    getGifts,
    updateGift,
}
export default GiftController;