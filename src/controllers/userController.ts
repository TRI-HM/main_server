import { Router } from "express";
import { UserClientType, UserModelType } from "../models/userModel";
import userService from "../services/userService";

const router = Router();

// POST /api/user/create
router.post("/create",
  async (req, res) => {
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
      console.log("User creation failed");
      // return res.status(500).json({ message: "User creation failed" }); //Todo : handle error properly. Create wrapper for error handling
    }
    res.send(newUser as UserModelType);
  });

// PUT /api/user/update/:uuid
router.patch("/update/:uuid",
  async (req, res) => {
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
      // return res.status(500).json({ message: "User update failed" }); //Todo : handle error properly. Create wrapper for error handling
    }
    res.send(true);
  });


export default router;
