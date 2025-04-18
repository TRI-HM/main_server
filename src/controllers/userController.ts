import { Router } from "express";
import { UserClientType, UserModelType } from "../models/userModel";
import { UUIDV4 } from "sequelize";
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

export default router;
