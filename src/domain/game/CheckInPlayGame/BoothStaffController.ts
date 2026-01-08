import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import boothStaffService from "../../../services/game/CheckInPlayGame/boothStaffService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createBoothStaff = wrapAsync(async (req: Request, res: Response) => {
  try {
    const { username, password, boothNumber } = req.body;
    if (!username || !password || !boothNumber) {
      res.status(400).json({ message: "Username, password and boothNumber are required" });
      return;
    }
    let passwordHashed = await bcrypt.hash(password, 10);
    let boothStaffData: Record<string, any> = {
      username: username,
      password: passwordHashed,
      boothNumber: boothNumber,
    };
    let boothStaff = await boothStaffService.createBoothStaff(boothStaffData);
    if (!boothStaff) {
      res.status(400).json({ message: "Failed to create booth staff" });
      return;
    }
    res.status(200).json({ message: "Booth staff created successfully", data: boothStaff });
  } catch (error) {
    res.status(500).json({ message: "Failed to create booth staff", error: error });
  }
});

const getBoothStaff = wrapAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }
    let boothStaff = await boothStaffService.getOneBoothStaff(id);
    if (!boothStaff) {
      res.status(404).json({ message: "Booth staff not found" });
      return;
    }
    res.status(200).json({ message: "Booth staff found", data: boothStaff });
  } catch (error) {
    res.status(500).json({ message: "Failed to get booth staff", error: error });
  }
});

const getAllBoothStaffs = wrapAsync(async (req: Request, res: Response) => {
  try {
    let boothStaffs = await boothStaffService.getAllBoothStaffs();
    res.status(200).json({ message: "Booth staffs found", data: boothStaffs });
  } catch (error) {
    res.status(500).json({ message: "Failed to get booth staffs", error: error });
  }
});

const updateBoothStaff = wrapAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }
    const { username, password, boothNumber } = req.body;
    let boothStaffData: Record<string, any> = {};
    
    if (username) boothStaffData.username = username;
    if (password) {
      boothStaffData.password = await bcrypt.hash(password, 10);
    }
    if (boothNumber !== undefined) boothStaffData.boothNumber = boothNumber;

    let updatedBoothStaff = await boothStaffService.updateBoothStaff(id, boothStaffData);
    if (!updatedBoothStaff) {
      res.status(400).json({ message: "Failed to update booth staff" });
      return;
    }
    res.status(200).json({ message: "Booth staff updated successfully", data: updatedBoothStaff });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booth staff", error: error });
  }
});

const deleteBoothStaff = wrapAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }
    let deleted = await boothStaffService.deleteBoothStaff(id);
    if (!deleted) {
      res.status(400).json({ message: "Failed to delete booth staff" });
      return;
    }
    res.status(200).json({ message: "Booth staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booth staff", error: error });
  }
});

const signinBoothStaff = wrapAsync(async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    let boothStaff = await boothStaffService.signinBoothStaff(username, password);
    if (!boothStaff) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }
    let token = jwt.sign({ boothStaffId: boothStaff.id }, process.env.JWT_SECRET!, { expiresIn: "5h" });
    res.status(200).json({ message: "Booth staff signed in successfully", data: { username, token, boothNumber: boothStaff.boothNumber } });
  } catch (error) {
    res.status(500).json({ message: "Failed to sign in booth staff", error: error });
  }
});

const BoothStaffController = {
  createBoothStaff,
  getBoothStaff,
  getAllBoothStaffs,
  updateBoothStaff,
  deleteBoothStaff,
  signinBoothStaff,
};

export default BoothStaffController;

