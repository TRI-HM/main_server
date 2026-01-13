import validateFields from "../../../util/validateField";
import { BoothModelSequelize, BoothModelType, BoothModelClientType, boothUseCase } from "../../../models/game/checkIn/booths.model";

const createBooth = async (booth: BoothModelClientType): Promise<BoothModelType | null> => {
    if (!validateFields(booth, BoothModelSequelize)) {
        return null;
    }
    let newBooth = await boothUseCase.create(booth);
    if (!newBooth) {
        return null;
    }
    return newBooth;
}

const updateBooth = async (boothCode: string, booth: BoothModelClientType): Promise<BoothModelType | null> => {
    if (!validateFields(booth, BoothModelSequelize)) {
        return null;
    }
    let updatedBooth = await boothUseCase.update(boothCode, booth);
    if (!updatedBooth) {
        return null;
    }
    return updatedBooth;
}

const getOneBooth = async (boothCode: string): Promise<BoothModelType | null> => {
    let booth = await boothUseCase.getOneByCode(boothCode);
    if (!booth) {
        return null;
    }
    return booth;
}

const getAllBooths = async (): Promise<BoothModelType[] | null> => {
    let booths = await boothUseCase.getAll();
    if (!booths || booths.length === 0) {
        return null;
    }
    return booths;
}

const deleteBooth = async (boothCode: string): Promise<boolean> => {
    let deletedBoothResult = await boothUseCase.delete(boothCode);
    if (!deletedBoothResult) {
        return false;
    }
    return true;
}

export default {
    createBooth,
    updateBooth,
    getOneBooth,
    getAllBooths,
    deleteBooth,
};
