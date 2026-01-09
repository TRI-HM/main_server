import validateFields from "../../../util/validateField";
import { GiftModelSequelize, GiftModelType } from "../../../models/game/CheckInPlayGame/gift";
import { GiftUseCase } from "../../../models/game/CheckInPlayGame/gift";
import { Op } from "sequelize";

const createGift = async (gift: Record<any, any>) => {
    if(!validateFields(gift, GiftModelSequelize)){
        return null;
    }
    let newGift = await GiftUseCase.create(gift);
    if(!newGift){
        return null;
    }
    return newGift;
}

const updateGift = async (id: number, gift: Record<any, any>) => {
    if(!validateFields(gift, GiftModelSequelize)){
        return null;
    }
    let updatedGift = await GiftUseCase.update(id, gift);
    if(!updatedGift){
        return null;
    }
    return updatedGift;
}

const getAllGifts = async (): Promise<GiftModelType[] | null> => {
    let gifts = await GiftUseCase.getAll();
    if(!gifts || gifts.length === 0){
        return null;
    }
    return gifts.map((gift: any) => gift.dataValues as GiftModelType);
}
const ValidateRedeemAble = async (): Promise<boolean> => {
    let gift = await GiftUseCase.filter({ is_active: true, quantity: { [Op.gt]: 0 } });
    if(!gift || gift.length === 0){
        return false;
    }
    return true;
}

export default {
    createGift,
    updateGift,
    ValidateRedeemAble,
    getAllGifts,
}