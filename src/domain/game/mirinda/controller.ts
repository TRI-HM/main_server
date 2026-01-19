import { Request, Response, Router } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import mediaService from "../../../services/mediaService";
import wishesService from "../../../services/game/mirinda/wishesService";
import localStorage from "../../../util/localStorage";
import { WishModelType } from "../../../models/wish";
import ioCustom from "../../../util/ioCustom";

const createWish = wrapAsync(
    async (req: Request, res: Response) => {
        console.log("Client request: ", req.body);
        let data = req.body;
        if(!data.phone || !data.wish) {
            res.status(400).json({ error: "Phone and wish are required" });
            return;
        }
        let mediaFile = req.file;
        if(!mediaFile) {
            res.status(400).json({ error: "Media file is required" });
            return;
        }
        let mediaUrl = `${process.env.BASE_URL}/images/uploads/${mediaFile.filename}`;
        
        // Map mimetype sang ENUM type ('image', 'video', 'audio', 'document')
        const getMediaType = (mimetype: string): 'image' | 'video' | 'audio' | 'document' => {
            if (mimetype.startsWith('image/')) return 'image';
            if (mimetype.startsWith('video/')) return 'video';
            if (mimetype.startsWith('audio/')) return 'audio';
            return 'document';
        };
        
        let newMediaData = {
            path: mediaUrl,
            type: getMediaType(mediaFile.mimetype), // Map sang ENUM value
            size: mediaFile.size,
            mimeType: mediaFile.mimetype,
            extension: mediaFile.mimetype.split('/')[1],
            name: mediaFile.originalname,
        }
        console.log("New media data: ", newMediaData);
        let newMedia = await mediaService.saveMedia(newMediaData);
        if(!newMedia) {
            res.status(400).json({ error: "Media creation failed" });
            return;
        }
        let isWishExist: WishModelType[] | null = await wishesService.searchWishesByPhone(data.phone) as WishModelType[] | null;
        console.log("Is wish exist: ", isWishExist);
        if(isWishExist && isWishExist.length > 0) {
            let response = ioCustom.toResponse(200, "Wish already exists", isWishExist);
            res.status(200).json(response);
            return;
        }
        // let newWishData = {
        //     phone: data.phone,
        //     message: data.wish,
        //     mediaId: newMedia.id as number,
        // }
        // console.log("New wish data: ", newWishData);
        // let newWish = await wishesService.create(newWishData);
        // if(!newWish) {
        //     res.status(400).json({ error: "Wish creation failed" });
        //     return;
        // }
        // let response = ioCustom.toResponse(200, "Wish created successfully", newWish);
        // res.status(200).json(response);
        res.status(200).json({ message: "Wish already exists" });
    }
);

const getAllWishes = wrapAsync(
    async (req: Request, res: Response) => {
        let wishes = await wishesService.getAll();
        if(!wishes) {
            res.status(400).json({ error: "Wishes not found" });
            return;
        }
        let response = ioCustom.toResponse(200, "Wishes fetched successfully", wishes);
        res.status(200).json(response);
    }
);

const getValidatedWishes = wrapAsync(
    async (req: Request, res: Response) => {
        let lastCreatedAt = req.query.lastCreatedAt as string;
        let limit = req.query.limit as string;
        let wishes = await wishesService.getValidatedWishes(lastCreatedAt ? new Date(lastCreatedAt) : undefined, limit ? parseInt(limit) : 10);
        if(!wishes) {
            res.status(400).json({ error: "Wishes not found" });
            return;
        }
        let response = ioCustom.toResponse(200, "Wishes fetched successfully", wishes);
        res.status(200).json(response);
    }
);

const getUnverifiedWishes = wrapAsync(
    async (req: Request, res: Response) => {
        let wishes = await wishesService.getUnverifiedWishes();
        if(!wishes) {
            res.status(400).json({ error: "Wishes not found" });
            return;
        }
        let response = ioCustom.toResponse(200, "Wishes fetched successfully", wishes);
        res.status(200).json(response);
    }
);
const getIsUnverifiedWishExist = wrapAsync(
    async (req: Request, res: Response) => {
        let isUnverifiedWishExist = await wishesService.getIsUnverifiedWishExist();
        let response = ioCustom.toResponse(200, "Is unverified wish exist fetched successfully", isUnverifiedWishExist);
        res.status(200).json(response);
    }
);

const updateWish = wrapAsync(
    async (req: Request, res: Response) => {
        let id = parseInt(req.params.id);
        
        // Chỉ lấy những trường được truyền vào (không phải undefined)
        let wish: Partial<WishModelType> = {};
        
        if (req.body.phone !== undefined) wish.phone = req.body.phone;
        if (req.body.message !== undefined) wish.message = req.body.message;
        if (req.body.mediaId !== undefined) wish.mediaId = parseInt(req.body.mediaId);
        if (req.body.isValid !== undefined) wish.isValid = req.body.isValid;
        if (req.body.validateOrder !== undefined) wish.validateOrder = parseInt(req.body.validateOrder);
        
        // Kiểm tra nếu không có trường nào để update
        if (Object.keys(wish).length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }
        
        let updatedWish = await wishesService.update(id, wish as WishModelType);

        if(!updatedWish) {
            res.status(400).json({ error: "Wish update failed" });
            return;
        }
        let response = ioCustom.toResponse(200, "Wish updated successfully", updatedWish);
        res.status(200).json(response);
    }
);

const validateWish = wrapAsync(
    async (req: Request, res: Response) => {
        let id = parseInt(req.params.id);
        let existingWish = await wishesService.getOne(id);
        if(!existingWish) {
            res.status(400).json({ error: "Wish not found" });
            return;
        }
        if(existingWish.isValid) {
            res.status(400).json({ error: "Wish already validated" });
            return;
        }
        let validatedWish = await wishesService.validateWish(id);
        let response = ioCustom.toResponse(200, "Wish validated successfully", validatedWish);
        res.status(200).json(response);
    }
);

const getOneWish = wrapAsync(
    async (req: Request, res: Response) => {
        let id = parseInt(req.params.id);
        let wish = await wishesService.getOne(id);
        let media = await mediaService.getOneMedia(wish?.mediaId as number);
        if(!wish || !media) {
            res.status(400).json({ error: "Wish not found" });
            return;
        }
        let response = ioCustom.toResponse(200, "Wish fetched successfully", { wish, media });
        res.status(200).json(response);
    }
);

const searchWishesByPhone = wrapAsync(
    async (req: Request, res: Response) => {
        let phone = req.params.phone;
        let wishes = await wishesService.searchWishesByPhone(phone);
        let response = ioCustom.toResponse(200, "Wishes fetched successfully", wishes);
        res.status(200).json(response);
    }
);
const wishController = {
    createWish,
    getAllWishes,
    getValidatedWishes,
    getUnverifiedWishes,
    getIsUnverifiedWishExist,
    updateWish,
    validateWish,
    getOneWish,
    searchWishesByPhone
}
export default wishController;
