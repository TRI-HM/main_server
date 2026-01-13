import validateFields from "../../../util/validateField";
import { BoothAccountModelSequelize, BoothAccountModelClientType, BoothAccountModelType, boothAccountUseCase } from "../../../models/game/checkIn/boothAcc.model";

const createBoothAccount = async (boothAccount: BoothAccountModelClientType): Promise<BoothAccountModelType | null> => {
    if (!validateFields(boothAccount, BoothAccountModelSequelize)) {
        return null;
    }
    return await boothAccountUseCase.create(boothAccount);
}

const getOneByUsername = async (username: string): Promise<BoothAccountModelType | null> => {
    return await boothAccountUseCase.getOneByUsername(username);
}

const updateBoothAccount = async (id: number, boothAccount: BoothAccountModelClientType): Promise<BoothAccountModelType | null> => {
    if (!validateFields(boothAccount, BoothAccountModelSequelize)) {
        return null;
    }
    return await boothAccountUseCase.update(id, boothAccount);
}

export default {
    createBoothAccount,
    getOneByUsername,
    updateBoothAccount,
};