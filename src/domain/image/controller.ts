import { Request, Response } from "express";
import { wrapAsync } from "../../middleware/wrapAsync";

const getOne = wrapAsync(
  async (req: Request, res: Response) => {
    let uuid: string = req.params.uuid;
    let image = await imageService.getOne(uuid);
    if (!image) {
      console.log("Image not found");
      res.send(false);
      return;
    }
    res.send(image as ImageModelType);
    return;
  }
);

const imageController = {
  getOne,
};
export default imageController;