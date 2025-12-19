import { Router } from "express";
import videoController from "./controller";
import { uploadVideoMulterHandle } from "../../util/videoMulther";
import { validateVideoFileMiddleware } from "../../middleware/validateVideoFile";

const router = Router();

router.post(
    "/post",
    uploadVideoMulterHandle.single("video"),
    validateVideoFileMiddleware,
    videoController.postVideo
);

// router.get(
//     "/getAll",
//     videoController.getAll
// );
export default router;