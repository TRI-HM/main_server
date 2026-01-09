import { Router } from "express";
import wishController from "./controller";
import { uploadMulterHandle } from "../../../middleware/multher";

const wishRouter = Router();

wishRouter.post("/create", uploadMulterHandle.single('media'), wishController.createWish);
wishRouter.put("/update/:id", wishController.updateWish);
wishRouter.get("/getAll", wishController.getAllWishes);
wishRouter.get("/get/:id", wishController.getOneWish);
wishRouter.get("/getValidatedWishes", wishController.getValidatedWishes);
wishRouter.get("/getUnverifiedWishes", wishController.getUnverifiedWishes);
wishRouter.get("/getIsUnverifiedWishExist", wishController.getIsUnverifiedWishExist);
wishRouter.post("/validate/:id", wishController.validateWish);
wishRouter.get("/search", wishController.searchWishesByPhone);

export default wishRouter;