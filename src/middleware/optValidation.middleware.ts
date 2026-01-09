import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { wrapAsync } from "../util/wrapAsync";

export const validateOTP = wrapAsync((req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.body;
    console.log(user_id);

    // TODO: validate user_id is valid
    axios.post(`http://localhost:9000/v1/otp/request`, { user_id })
        .then((response: any) => {
            console.log(response.data);
            if (response.data.code === 200) {
                console.log(response.data.data);
                res.send({ message: "OTP validation successful", data: response.data.data });
                return;
                // next();
            } else {
                res.status(400).send({ message: response.data.message || "OTP validation failed" });
                return;
            }
        })
        .catch((error: any) => {
            console.log(error.response.data);
            res.status(500).send({ message: error.response.data.message || "Internal server error" });
            return;
        });

    if (!user_id) {
        res.status(400).send({ message: "User ID is required" });
        return;
    }
    // next();
});