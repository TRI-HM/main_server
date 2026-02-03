import { BoothAccountModelSequelize, BoothAccountModelType, BoothAccountModelClientType, boothAccountUseCase } from "../../../models/game/checkIn/boothAcc.model";
import validateFields from "../../../util/validateField";
import bcrypt from "bcrypt";

const createBoothStaff = async (boothStaff: BoothAccountModelClientType) => {
  if (!validateFields(boothStaff, BoothAccountModelSequelize)) {
    return null;
  }
  let newBoothStaff = await boothAccountUseCase.create(boothStaff);
  if (!newBoothStaff) {
    return null;
  }
  return newBoothStaff;
};

const getOneBoothStaff = async (id: number): Promise<BoothAccountModelType | null> => {
  // boothAccountUseCase doesn't have getOne, need to implement or use different approach
  return null;
};

const getAllBoothStaffs = async (): Promise<BoothAccountModelType[]> => {
  // boothAccountUseCase doesn't have getAll, need to implement
  return [];
};

const updateBoothStaff = async (id: number, boothStaffData: BoothAccountModelClientType): Promise<BoothAccountModelType | null> => {
  const updated = await boothAccountUseCase.update(id, boothStaffData);
  if (!updated) {
    return null;
  }
  return updated;
};

const deleteBoothStaff = async (id: number): Promise<boolean> => {
  // boothAccountUseCase doesn't have delete, need to implement
  return false;
};

const signinBoothStaff = async (username: string, password: string): Promise<BoothAccountModelType | null> => {
  let staff = await boothAccountUseCase.getOneByUsername(username);
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

