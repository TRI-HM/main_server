import { Request, Response } from "express";
import { wrapAsync } from "../../middleware/wrapAsync";
import imageService from "./service";

const getOne = wrapAsync(
  async (req: Request, res: Response) => {
    let uuid: string = req.params.uuid;
    let image = await imageService.getOne(uuid);
    if (!image) {
      console.log("Image not found");
      res.send(false);
      return;
    }
    res.sendFile;
    return;
  }
);

const imageController = {
  getOne,
};
export default imageController;