/**
 * @UNUSED — Middleware này hiện KHÔNG được gắn vào bất kỳ route nào.
 *
 * File được import trong `src/domain/login/route.ts` nhưng không sử dụng.
 * Giữ lại để tham khảo, nhưng KHÔNG ảnh hưởng đến runtime.
 *
 * ---
 * Mục đích ban đầu:
 *   Validate OTP bằng cách gọi internal OTP service tại http://localhost:9000/v1/otp/request
 *   trước khi cho phép request đi tiếp vào controller.
 *
 * Vấn đề cần fix nếu muốn dùng lại:
 *   1. URL service `http://localhost:9000` hardcode — nên dùng env variable
 *   2. Check `!user_id` nằm sau async call → không bao giờ chạy được (race condition)
 *   3. `next()` bị comment → middleware không bao giờ gọi controller tiếp theo
 *   4. Logic gọi OTP request không phù hợp để đặt ở middleware login —
 *      nên chuyển thành service call trong controller
 *
 * TODO: quyết định xóa hoặc refactor hoàn toàn file này.
 */

import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { wrapAsync } from "../util/wrapAsync";

export const validateOTP = wrapAsync((req: Request, res: Response, _next: NextFunction) => {
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
