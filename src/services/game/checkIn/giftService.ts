import validateFields from "../../../util/validateField";
import { GiftModelSequelize, GiftModelType, GiftModelClientType, giftUseCase } from "../../../models/game/checkIn/gift.model";
import { Op } from "sequelize";

const createGift = async (gift: GiftModelClientType): Promise<GiftModelType | null> => {
    if (!validateFields(gift, GiftModelSequelize)) {
        return null;
    }
    let newGift = await giftUseCase.create(gift);
    if (!newGift) {
        return null;
    }
    return newGift;
}

const updateGift = async (id: number, gift: GiftModelClientType): Promise<GiftModelType | null> => {
    if (!validateFields(gift, GiftModelSequelize)) {
        return null;
    }
    let updatedGift = await giftUseCase.update(id, gift);
    if (!updatedGift) {
        return null;
    }
    return updatedGift;
}

const getAllGifts = async (): Promise<GiftModelType[] | null> => {
    let gifts = await giftUseCase.getAll();
    if (!gifts || gifts.length === 0) {
        return null;
    }
    return gifts;
}

const ValidateRedeemAble = async (): Promise<boolean> => {
    let gifts = await giftUseCase.getAll();
    if (!gifts || gifts.length === 0) {
        return false;
    }
    // Check if there's any active gift with quantity > 0
    const hasRedeemableGift = gifts.some(gift => gift.is_active && gift.quantityRemaining > 0);
    return hasRedeemableGift;
}

export default {
    createGift,
    updateGift,
    getAllGifts,
    ValidateRedeemAble,
}