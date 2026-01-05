import { DataTypes, Op } from "sequelize";
import SequelizeDB from "../database/db";


const WishModelSequelize = SequelizeDB.define("wishes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  "message": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "mediaId": {
    type: DataTypes.INTEGER,
    references: {
      model: "media",
      key: "id"
    },
    allowNull: false
  },
  "phone": {
    type: DataTypes.STRING,
    allowNull: false
  },
  "isValid": {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  "validateOrder": {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  "createdAt": {
    type: DataTypes.DATE(),
    allowNull: false
  },
  "updatedAt": {
    type: DataTypes.DATE(),
    allowNull: false
  },
  "deletedAt": {
    type: DataTypes.DATE(),
  }
});

export type WishModelType = {
  id?: number;
  message: string;
  mediaId: number;
  phone: string;
  isValid?: boolean;
  validateOrder?: number;
};

interface IWishUseCase {
    create: (wish: WishModelType) => Promise<WishModelType | null>,
    update: (id: number, wish: WishModelType) => Promise<WishModelType | null>,
    getAll: () => Promise<WishModelType[] | null>,
    getOne: (id: number) => Promise<WishModelType | null>,
    delete: (id: number) => Promise<boolean>,
    getUnverifiedWishes: () => Promise<WishModelType[] | null>,
    getValidatedWishes: (lastCreatedAt?: Date, limit?: number) => Promise<WishModelType[] | null>,
    getIsUnverifiedWishExist: () => Promise<boolean>,
    validateWish: (id: number) => Promise<WishModelType | null>,
    searchWishesByPhone: (phone: string) => Promise<WishModelType[] | null>,
}
const createWish = async (wish: WishModelType): Promise<WishModelType | null> => {
  try {
    // Loại bỏ id nếu có để Sequelize tự động tạo
    const { id, ...wishWithoutId } = wish;
    const newWish = await WishModelSequelize.create(wishWithoutId);
    if (!newWish) return null;
    return newWish.dataValues as WishModelType;
  } catch (error) {
    console.error("Error creating wish: ", error);
    throw new Error("Failed to create wish");
  }
}

const updateWish = async (id: number, wish: WishModelType): Promise<WishModelType | null> => {
    try {
        // Chỉ lấy những trường có giá trị (không phải undefined)
        const updateData: Partial<WishModelType> = {};
        
        if (wish.message !== undefined) updateData.message = wish.message;
        if (wish.mediaId !== undefined) updateData.mediaId = wish.mediaId;
        if (wish.phone !== undefined) updateData.phone = wish.phone;
        if (wish.isValid !== undefined) updateData.isValid = wish.isValid;
        if (wish.validateOrder !== undefined) updateData.validateOrder = wish.validateOrder;
        
        // Nếu không có trường nào để update, trả về null
        if (Object.keys(updateData).length === 0) {
            return null;
        }
        
        let [wishUpdateAffected] = await WishModelSequelize.update(
            updateData, 
            {
                where: { id }
            }
        );
        
        if(wishUpdateAffected === 0) return null;
        const updatedWish = await WishModelSequelize.findOne({ where: { id } });
        if (!updatedWish) return null;
        return updatedWish.dataValues as WishModelType;
    } catch (error) {
        console.error("Error updating wish: ", error);
        throw new Error("Failed to update wish");
    }
}

const getAllWishes = async (): Promise<WishModelType[] | null> => {
    try {
        const wishes = await WishModelSequelize.findAll();
        if (!wishes) return null;
        return wishes.map(wish => wish.dataValues as WishModelType);
    } catch (error) {
        throw new Error("Failed to get all wishes");
    }
}

const getOneWish = async (id: number): Promise<WishModelType | null> => {
    try {
        const wish = await WishModelSequelize.findOne({ where: { id } });
        if (!wish) return null;
        return wish.dataValues as WishModelType;
    } catch (error) {
        throw new Error("Failed to get one wish");
    }
}

const deleteWish = async (id: number): Promise<boolean> => {
    try {
        const deletedWish = await WishModelSequelize.destroy({ where: { id } });
        if (!deletedWish) return false;
        return true;
    } catch (error) {
        throw new Error("Failed to delete wish");
    }
}

const getUnverifiedWishes = async (): Promise<WishModelType[] | null> => {
    try {
        const wishes = await WishModelSequelize.findAll({ where: { isValid: null }, order: [['createdAt', 'ASC']] });
        if (!wishes) return null;
        return wishes.map(wish => wish.dataValues as WishModelType);
    } catch (error) {
        console.error("Error getting unverified wishes: ", error);
        throw new Error("Failed to get unverified wishes");
    }
}

const getValidatedWishes = async (lastCreatedAt?: Date, limit?: number): Promise<WishModelType[] | null> => {
    try {
        if (lastCreatedAt) {
            const wishes = await WishModelSequelize.findAll({ where: { isValid: true, createdAt: { [Op.lt]: lastCreatedAt } }, order: [['createdAt', 'DESC']], limit: limit });
            if (!wishes) return null;
            return wishes.map(wish => wish.dataValues as WishModelType);
        } else {
            const wishes = await WishModelSequelize.findAll({ where: { isValid: true }, order: [['createdAt', 'DESC']], limit: limit });
            if (!wishes) return null;
            return wishes.map(wish => wish.dataValues as WishModelType);
        }
    } catch (error) {
        console.error("Error getting validated wishes: ", error);
        throw new Error("Failed to get validated wishes");
    }
}


// search by phone
const searchWishesByPhone = async (phone: string): Promise<WishModelType[] | null> => {
    try {
        const wishes = await WishModelSequelize.findAll({ where: { phone: phone } });
        if (!wishes) return null;
        return wishes.map(wish => wish.dataValues as WishModelType);
    } catch (error) {
        console.error("Error searching wishes: ", error);
        throw new Error("Failed to search wishes");
    }
}

const getIsUnverifiedWishExist = async (): Promise<boolean> => {
    try {
        const isUnverifiedWishExist = await WishModelSequelize.findOne({ where: { isValid: null, validateOrder: null } });
        if (isUnverifiedWishExist) return true;
        return false;
    } catch (error) {
        console.error("Error getting is unverified wish exist: ", error);
        throw new Error("Failed to get is unverified wish exist");
    }
}

const validateWish = async (id: number): Promise<WishModelType | null> => {
    try {
        let lastValidateOrder: number | null = await WishModelSequelize.max('validateOrder');
        let validateOrder = 1;
        if (lastValidateOrder) validateOrder = lastValidateOrder + 1;
        
        const updatedWish = await updateWish(id, { isValid: true, validateOrder: validateOrder } as WishModelType);
        if (!updatedWish) return null;
        return updatedWish;
    } catch (error) {
        console.error("Error validating wish: ", error);
        throw new Error("Failed to validate wish");
    }
}

export const wishUseCase: IWishUseCase = {
    create: createWish,
    update: updateWish,
    getAll: getAllWishes,
    getOne: getOneWish,
    delete: deleteWish,
    getUnverifiedWishes: getUnverifiedWishes,
    getValidatedWishes: getValidatedWishes,
    getIsUnverifiedWishExist: getIsUnverifiedWishExist,
    validateWish: validateWish,
    searchWishesByPhone: searchWishesByPhone
}

export default wishUseCase;