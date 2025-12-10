import { Response, Request, Router } from "express";
import { IUserUseCase, UserClientType, UserModelType } from "../../models/userModel";
import userService from "../../services/userService";
import { wrapAsync } from "../../middleware/wrapAsync";
import ioCustom from "../../util/ioCustom";
import { StatusCodes } from "http-status-codes";

const router = Router();


const create = wrapAsync(
  async (req: Request, res: Response) => {
    console.log("Client request: ", req.body);
    let user: UserClientType = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      gift: req.body.gift,
      note: req.body.note,
    };

    // Todo: middleware to validate user data. Return user type if valid, else return error.
    console.log("Validated user data");

    let newUser = await userService.create(user);
    if (!newUser) {
      throw new Error("User creation failed");
    }
    res.send(newUser as UserModelType);
    return;
  }
);

const update = wrapAsync(
  async (req: Request, res: Response) => {
    let user: UserClientType = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      gift: req.body.gift,
      note: req.body.note,
    };
    let uuid: string = req.params.uuid;
    let updatedUser = await userService.update(uuid, user);
    if (!updatedUser) {
      console.log("User update failed");
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ioCustom.toResponseError({ code: 500, message: "User update failed" }));
      return;
    }
    res.send(true);
    return
  });

const getOne = wrapAsync(
  async (req: Request, res: Response) => {
    let uuid: string = req.params.uuid;
    let user = await userService.getOne(uuid);
    if (!user) {
      console.log("User not found");
      res.send(false);
      return;
    }
    res.send(user as UserModelType);
    return;
  });

const getAll = wrapAsync(
  async (req: Request, res: Response) => {
    let users = await userService.getAll();
    if (!users) {
      console.log("Users not found");
      res.send(false); //Todo : handle error properly. Create wrapper for error handling
      return;
    }
    res.send(users as UserModelType[]);
    return;
  }
);

// const updateVote = wrapAsync(
//   async (req: Request, res: Response) => {
//     let phone: string = req.params.phone;
//     let vote: string = req.body.vote;
//     let updatedUser = await userService.updateVote(phone, vote);
//     if (!updatedUser) {
//       console.log("User update failed");
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json(io.toResponseError({ code: 500, message: "User update failed" }));
//       return;
//     }
//     res.send(true);
//     return
//   });

const userController = {
  create,
  update,
  getOne,
  getAll,
  // updateVote
};
export default userController;