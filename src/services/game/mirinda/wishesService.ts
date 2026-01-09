import { wishUseCase, WishModelType } from "../../../models/wish";

const create = async (wish: WishModelType): Promise<WishModelType | null> => {
    // Loại bỏ id nếu có để Sequelize tự động tạo
    const { id, ...wishWithoutId } = wish;
    let newWish = await wishUseCase.create(wishWithoutId);
    if (!newWish) return null;
    return newWish;
}

const update = async (id: number, wish: WishModelType): Promise<WishModelType | null> => {
    try {
        let updatedWish = await wishUseCase.update(id, wish);
        if (!updatedWish) return null;
        return updatedWish;
    } catch (error) {
        console.error("Error updating wish: ", error);
        return null;
    }
}

const getAll = async (): Promise<WishModelType[] | null> => {
    try {
        let wishes = await wishUseCase.getAll();
        if (!wishes) return null;
        return wishes;
    } catch (error) {
        console.error("Error getting all wishes: ", error);
        throw new Error("Failed to get all wishes");
    }
}

const getOne = async (id: number): Promise<WishModelType | null> => {
    try {
        let wish = await wishUseCase.getOne(id);
        if (!wish) return null;
        return wish;
    } catch (error) {
        console.error("Error getting one wish: ", error);
        throw new Error("Failed to get one wish");
    }
}

const deleteOne = async (id: number): Promise<boolean> => {
    try {
        let deletedWish = await wishUseCase.delete(id);
        if (!deletedWish) return false;
        return true;
    } catch (error) {
        console.error("Error deleting wish: ", error);
        throw new Error("Failed to delete wish");
    }
}

const getUnverifiedWishes = async (): Promise<WishModelType[] | null> => {
    try {
        let wishes = await wishUseCase.getUnverifiedWishes();
        if (!wishes) return null;
        return wishes;
    } catch (error) {
        console.error("Error getting unverified wishes: ", error);
        throw new Error("Failed to get unverified wishes");
    }
}

const getValidatedWishes = async (lastCreatedAt?: Date, limit?: number): Promise<WishModelType[] | null> => {
    try {
        let wishes = await wishUseCase.getValidatedWishes(lastCreatedAt, limit);
        if (!wishes) return null;
        return wishes;
    } catch (error) {
        console.error("Error getting validated wishes: ", error);
        throw new Error("Failed to get validated wishes");
    }
}

const getIsUnverifiedWishExist = async (): Promise<boolean> => {
    try {
        let isUnverifiedWishExist = await wishUseCase.getIsUnverifiedWishExist();
        if (!isUnverifiedWishExist) return false;
        return true;
    } catch (error) {
        console.error("Error getting is unverified wish exist: ", error);
        throw new Error("Failed to get is unverified wish exist");
    }
}

const validateWish = async (id: number): Promise<WishModelType | null> => {
    try {
        let validatedWish = await wishUseCase.validateWish(id);
        if (!validatedWish) return null;
        let validatedWishRecord = await wishUseCase.getOne(id);
        if (!validatedWishRecord) return null;
        return validatedWishRecord;
    } catch (error) {
        console.error("Error validating wish: ", error);
        throw new Error("Failed to validate wish");
    }
}

const searchWishesByPhone = async (phone: string): Promise<WishModelType[] | null> => {
    try {
        let wishes = await wishUseCase.searchWishesByPhone(phone);
        if (!wishes) return null;
        return wishes;
    } catch (error) {
        console.error("Error searching wishes by phone: ", error);
        throw new Error("Failed to search wishes by phone");
    }
}
const wishesService = {
    create,
    update,
    getAll,
    getOne,
    deleteOne,
    getUnverifiedWishes,
    getValidatedWishes,
    getIsUnverifiedWishExist,
    validateWish,
    searchWishesByPhone
}
export default wishesService;

