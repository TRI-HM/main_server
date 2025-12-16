import { Response, Request, Router } from "express";
import { GameVitaminClientType, GameVitaminModelType } from "../../../models/game/vitamin";
import vitaminService from "../../../services/game/vitamin/vitaminService";
import { wrapAsync } from "../../../util/wrapAsync";
// import io from "../../../util/io";
// import { StatusCodes } from "http-status-codes";

const router = Router();

const create = wrapAsync(
  async (req: Request, res: Response) => {
    console.log("Client request: ", req.body);
    let row: GameVitaminClientType = {
      win: req.body.win
    };

    // Todo: middleware to validate user data. Return user type if valid, else return error.
    console.log("Validated user data");

    let newRow = await vitaminService.create(row);
    if (!newRow) {
      throw new Error("Row creation failed");
    }
    res.send(newRow as GameVitaminModelType);
    return;
  }
);

const getOne = wrapAsync(
  async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
      let idNum = parseInt(id, 10);
      let row = await vitaminService.getOne(idNum);
      if (!row) {
        console.log("Row not found");
        res.send(false);
        return;
      }
      res.send(row as GameVitaminModelType);
      return;
    } catch (error) {
      console.log("Invalid ID format");
      res.status(400).send("Invalid ID format");
      return;
    }

  });

const getAll = wrapAsync(
  async (req: Request, res: Response) => {
    let table = await vitaminService.getAll();
    if (!table) {
      console.log("Table not found");
      res.send(false); //Todo : handle error properly. Create wrapper for error handling
      return;
    }
    res.send(table as GameVitaminModelType[]);
    return;
  }
);

const vitaminController = {
  create,
  getOne,
  getAll,
};
export default vitaminController;