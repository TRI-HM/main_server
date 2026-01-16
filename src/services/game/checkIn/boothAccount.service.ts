import validateFields from "../../../util/validateField";
import { BoothAccountModelSequelize, BoothAccountModelClientType, BoothAccountModelType, boothAccountUseCase, IBoothAccountUseCase } from "../../../models/game/checkIn/boothAcc.model";

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

const getBoothCodeByUsername = async (username: string): Promise<BoothAccountModelType | null> => {
    return await boothAccountUseCase.getBoothCodeByUsername(username);
}

const boothAccountService: IBoothAccountUseCase = {
    create: createBoothAccount,
    getOneByUsername,
    update: updateBoothAccount,
    getBoothCodeByUsername,
};

export default boothAccountService;