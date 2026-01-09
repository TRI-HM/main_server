import { AdminAccountModelSequelize, AdminAccountModelType } from "../../../models/game/CheckInPlayGame/adminaccount";
import validateFields from "../../../util/validateField";
import { AdminAccountUseCase } from "../../../models/game/CheckInPlayGame/adminaccount";
import bcrypt from "bcrypt";
import RedisClient from "../../../util/redisClient";

const createAdmin = async (admin: Record<any, any>) => {
    if(!validateFields(admin, AdminAccountModelSequelize)){
        return null;
    }
    let newAdmin = await AdminAccountUseCase.create(admin);
    if(!newAdmin){
        return null;
    }
    return newAdmin;
};

const getOneAdmin = async (id: string): Promise<AdminAccountModelType | null> => {
    let admin = await AdminAccountUseCase.getOne(id);
    if(!admin){
        return null;
    }
    return admin;
}
const signinAdmin = async (username: string, password: string): Promise<AdminAccountModelType | null> => {
    let admin = await AdminAccountUseCase.getOneByUsername(username);
    if(!admin){
        return null;   
    }
    let matchPassword = await bcrypt.compare(password, admin.password);
    if(!matchPassword){
        return null;
    }

    return admin;
}

export default {
    createAdmin,
    getOneAdmin,
    signinAdmin,
}