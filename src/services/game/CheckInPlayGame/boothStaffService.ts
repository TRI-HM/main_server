import { BoothStaffModelSequelize, BoothStaffModelType } from "../../../models/game/CheckInPlayGame/boothstaff";
import validateFields from "../../../util/validateField";
import { BoothStaffUseCase } from "../../../models/game/CheckInPlayGame/boothstaff";
import bcrypt from "bcrypt";

const createBoothStaff = async (boothStaff: Record<any, any>) => {
  if (!validateFields(boothStaff, BoothStaffModelSequelize)) {
    return null;
  }
  let newBoothStaff = await BoothStaffUseCase.create(boothStaff);
  if (!newBoothStaff) {
    return null;
  }
  return newBoothStaff;
};

const getOneBoothStaff = async (id: string): Promise<BoothStaffModelType | null> => {
  let staff = await BoothStaffUseCase.getOne(id);
  if (!staff) {
    return null;
  }
  return staff;
};

const getAllBoothStaffs = async (): Promise<BoothStaffModelType[]> => {
  return await BoothStaffUseCase.getAll();
};

const updateBoothStaff = async (id: string, boothStaffData: Record<any, any>): Promise<BoothStaffModelType | null> => {
  const updated = await BoothStaffUseCase.update(id, boothStaffData);
  if (!updated) {
    return null;
  }
  return await BoothStaffUseCase.getOne(id);
};

const deleteBoothStaff = async (id: string): Promise<boolean> => {
  return await BoothStaffUseCase.delete(id);
};

const signinBoothStaff = async (username: string, password: string): Promise<BoothStaffModelType | null> => {
  let staff = await BoothStaffUseCase.getOneByUsername(username);
  if (!staff) {
    return null;
  }
  let matchPassword = await bcrypt.compare(password, staff.password);
  if (!matchPassword) {
    return null;
  }
  return staff;
};

export default {
  createBoothStaff,
  getOneBoothStaff,
  getAllBoothStaffs,
  updateBoothStaff,
  deleteBoothStaff,
  signinBoothStaff,
};

