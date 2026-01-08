import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import playerService from "../../../services/game/CheckInPlayGame/playerService";
import { PlayerModelType, PlayerDataModelTypeParse } from "../../../models/game/CheckInPlayGame/player";
import giftService from "../../../services/game/CheckInPlayGame/giftService";
import adminService from "../../../services/game/CheckInPlayGame/adminService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const OTPGenerator = require("../../../util/otpGenerator");

const getOTP = wrapAsync(async (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone) {
        res.status(400).json({ message: "Phone is required" });
        return;
    }
    let otp = await OTPGenerator.generateOTP(phone);
    res.status(200).json({ message: "OTP generated successfully"});
});

const verifyOTP = wrapAsync(async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        res.status(400).json({ message: "Phone and OTP are required" });
        return;
    }
    let isOtpValid = await OTPGenerator.IsOtpValid(phone, otp);
    res.status(200).json({ message: "OTP verified successfully"});
});

const createPlayer = wrapAsync(async (req: Request, res: Response) => {
    console.log("Client request: ", req.body);
    try {
        let body = req.body;
        let username = body.username;
        let phone = body.phone;
        let email = body.email;
        let verifyCode = body.verifyCode;
        console.log("Username: ", username);
        console.log("Phone: ", phone);
        if(!verifyCode || !OTPGenerator.IsOtpValid(phone, verifyCode)) {
            res.status(400).json({ message: "Invalid verify code or verify code expired" });
            return;
        }
        if (!username || !phone) {
            res.status(400).json({ message: "Username and phone are required" });
            return;
        }
        let playerExists = await playerService.isPlayerExists(phone);
        if (playerExists) {
            res.status(400).json({ message: "Player already exists" });
            return;
        }
        let playerData: PlayerModelType = {
            username: username,
            phone: phone,
            redeem: 0,
            createdAt: new Date(),
        }
        let newPlayer = await playerService.createPlayer(playerData);
        let giftAble = await giftService.ValidateRedeemAble();
        if (!giftAble) {
            res.status(400).json({ message: "No gift available", redeemAble: giftAble });
            return;
        }
        if (!newPlayer) {
            throw new Error("Failed to create player");
        }
        res.status(200).json({ message: "Player created successfully", data: newPlayer });
    } catch (error) {
        res.status(500).json({ message: "Failed to create player", error: error });
    }
});

const checkInPlayGame = wrapAsync(async (req: Request, res: Response) => {
    console.log("Client request: ", req.body);
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
        let playerId = (decoded as any).playerId;
        if (playerId) {
            let boothId = body.boothId;
            if (!boothId) {
                res.status(400).json({ message: "boothId are required" });
                return;
            }
            let player: PlayerModelType | null = await playerService.getOnePlayer(playerId);
            if (!player) {
                res.status(400).json({ message: "Player not found" });
                return;
            }
            let boothIdString: string = matchBoothIdToPlayed(boothId);
            if (boothIdString == "") {
                res.status(400).json({ message: "Invalid boothId" });
                return;
            }
            let playerData: Record<string, any> = {
                [boothIdString]: true,
                [boothIdString + "_at"]: new Date(),
            }
            let playerUpdated: PlayerModelType | null = await playerService.updatePlayer(playerId, playerData);
            if (!playerUpdated) {
                res.status(500).json({ message: "Failed to update player" });
                return;
            }
            res.status(200).json({ message: "Player checked in play game successfully", data: playerUpdated });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to check in play game", error: error });
    }
});

const updatePlayer = wrapAsync(async (req: Request, res: Response) => {
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
        let playerId = (decoded as any).playerId;
        if (!playerId) {
            res.status(400).json({ message: "Player not found" });
            return;
        }
        let player: PlayerModelType | null = await playerService.getOnePlayer(playerId);
        if (!player) {
            res.status(400).json({ message: "Player not found" });
            return;
        }
        let playerData: Record<string, any> = {}
        
});

const getPlayerSelf = wrapAsync(async (req: Request, res: Response) => {
    try {
        let headers = req.headers;
        let token = headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return;
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (!decoded) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        let playerId = (decoded as any).playerId;
        if (!playerId) {
            res.status(400).json({ message: "Player not found" });
            return;
        }
        let player: PlayerModelType | null = await playerService.getOnePlayer(playerId);
        if (!player) {
            res.status(400).json({ message: "Player not found" });
            return;
        }
        res.status(200).json({ message: "Player found", data: player });
    } catch (error) {
        res.status(500).json({ message: "Failed to get player", error: error });
    }
});

const Signin = wrapAsync(async (req, res) => {
    const { phone, username } = req.body;
    if (!phone || !username) {
        res.status(400).json({ message: "Phone and username are required" });
    }
    let player: PlayerModelType | null = await playerService.getOneByPhoneAndUsername(phone, username);
    if (!player) {
        res.status(400).json({ message: "Player not found" });
        return;
    }

    // Perform authentication logic here
    const token = jwt.sign({ playerId: player.id }, process.env.JWT_SECRET!, { expiresIn: "5h" });
    res.send({ message: "User signed in", data: { phone, token } });
});

const createAdmin = wrapAsync(async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }
        let passwordHashed = await bcrypt.hash(password, 10);
        let adminData: Record<string, any> = {
            username: username,
            password: passwordHashed,
        }
        let admin = await adminService.createAdmin(adminData);
        if (!admin) {
            res.status(400).json({ message: "Failed to create admin" });
        }
        res.status(200).json({ message: "Admin created successfully", data: admin });
    }catch(error){
        res.status(500).json({ message: "Failed to create admin", error: error });
    }
});
const AdminSignin = wrapAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }
    let admin = await adminService.signinAdmin(username, password);
    if (!admin) {
        res.status(400).json({ message: "Invalid username or password" });
        return;
    }
    let token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, { expiresIn: "5h" });
    res.status(200).json({ message: "Admin signed in successfully", data: { username, token } });
});
const getAllPlayers = wrapAsync(async (req: Request, res: Response) => {
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
    const { limit, cursorId } = req.query;

    let players = await playerService.getAllPlayers(parseInt(limit as string) || 10, parseInt(cursorId as string) || 0);
    res.status(200).json({ message: "Players found", data: players });
});


// const getManyPlayers = wrapAsync(async (req: Request, res: Response) => {
//     console.log("Client request: ", req.body);
//     try {
//         let body = req.body;
//         let token = body.token;
//         let decoded = jwt.verify(token, process.env.JWT_SECRET!);
//         if(!decoded) {
//             res.status(400).json({ message: "Invalid token" });
//             return;
//         }
//         let playerId = (decoded as any).playerId;
//         if(!playerId){
//             res.status(400).json({ message: "Player not found" });
//             return;
//         }
//     }
// });

const matchBoothIdToPlayed = (boothId: number): string => {
    switch (boothId) {
        case 1:
            return "played_1";
        case 2:
            return "played_2";
        case 3:
            return "played_3";
        case 4:
            return "played_4";
        case 5:
            return "played_5";
        default:
            return "";
    };
};


const CheckInPlayGameController = {
    createPlayer,
    Signin,
    checkInPlayGame,
    getPlayerSelf,
    AdminSignin,
    createAdmin,
    getAllPlayers,
}
export default CheckInPlayGameController;