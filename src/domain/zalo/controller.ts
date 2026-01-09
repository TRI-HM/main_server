import { wrapAsync } from "../../middleware/wrapAsync";
import { Request, Response } from "express";
import path from "path";
import axios from "axios";
import localStorage from "../../util/localStorage";

const RecieveWebhook = wrapAsync(
    async (req: Request, res: Response) => {
        // Với Express, body đã được parse sẵn qua middleware `express.json()`
        const body = req.body;
        console.log("Zalo webhook body:", body);
        res.send({ message: "Webhook received" });
    }
);

// Trả về file HTML xác minh Zalo
const verify = wrapAsync(
    async (req: Request, res: Response) => {
        console.log("Zalo verify HTML");

        // Đường dẫn tuyệt đối tới file HTML trong cùng thư mục với controller này
        const filePath = path.join(
            __dirname,
            "zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html"
        );

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Lỗi khi gửi file verify Zalo:", err);
                // Fallback: trả JSON nếu có lỗi
                if (!res.headersSent) {
                    res.status(500).send("Internal Server Error");
                }
            }
        });
    }
);


const sendZNSMessage = async (phone: string) => {
    try {
        if (phone && phone.length === 10) {
            let accessToken = await getOAAccessToken();
            if (accessToken) {
                let trackingId = crypto.randomUUID();
                const ZNSMessageRequest = await axios.post("https://business.openapi.zalo.me/message/template", {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "access_token": accessToken,
                    },
                    data: {
                        template_id: process.env.ZALO_TEMPLATE_ID,
                        template_data: {
                            ky: "1",
                            thang: new Date().getMonth() + 1 + "/2020",
                            start_date: new Date().toLocaleDateString("vi-VN"),
                            end_date: new Date().toLocaleDateString("vi-VN"),
                            customer: "Nguyễn Thị Hoàng Anh",
                            cid: "PE010299485",
                            address: "VNG Campus, TP.HCM",
                            amount: "100",
                            total: "100000",
                        },
                        tracking_id: trackingId,
                    },
                });
                let data = ZNSMessageRequest.data;
                if (data.message_id) {
                    return data.message_id;
                }
                return null;
            } else {
                throw new Error("ZALO_ACCESS_TOKEN is not set");
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getOAAccessToken = async () => {
    try {
        let accessToken = localStorage.getItem("zalo_access_token");
        let accessTokenExpiresAt = localStorage.getItem("zalo_access_token_expires_at");
        if (accessToken && accessTokenExpiresAt && Date.now() < parseInt(accessTokenExpiresAt)) {
            return accessToken;
        } else {
            let refreshToken = localStorage.getItem("zalo_refresh_token");
            if (refreshToken) {
                let newAccessToken = await getOAAccessTokenByRefreshToken();
                if (newAccessToken) {
                    return newAccessToken;
                }
            }else {
                let newAccessToken = await getOAAccessTokenByAuthCode();
                if (newAccessToken) {
                    return newAccessToken;
                }
                return null;
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getOAAccessTokenByAuthCode = async () => {
    try {
        let code = process.env.ZALO_AUTHORIZATION_CODE;
        let secretKey = process.env.ZALO_SECRET_KEY;
        if (code && secretKey) {
            const AccessTokenRequest = await axios.post("https://oauth.zaloapp.com/v4/oa/access_token", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "secret_key": secretKey,
                },
                data: {
                    code: code,
                    app_id: process.env.ZALO_APP_ID,
                    grant_type: "client_credentials",
                },
            });
            let data = AccessTokenRequest.data;
            if (data.access_token && data.refresh_token) {
                localStorage.setItem("zalo_access_token", data.access_token);
                localStorage.setItem("zalo_refresh_token", data.refresh_token);
                localStorage.setItem("zalo_access_token_expires_at", (Date.now() + data.expires_in * 1000).toString());
                return data.access_token;
            }
            return null;
        } else {
            throw new Error("ZALO_AUTHORIZATION_CODE or ZALO_SECRET_KEY is not set");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getOAAccessTokenByRefreshToken = async () => {
        try {
            let refreshToken = localStorage.getItem("zalo_refresh_token");
            let secretKey = process.env.ZALO_SECRET_KEY;
            if (refreshToken && secretKey) {
                const AccessTokenRequest = await axios.post("https://oauth.zaloapp.com/v4/oa/access_token", {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "secret_key": secretKey,
                    },
                    data: {
                        grant_type: "refresh_token",
                        refresh_token: refreshToken,
                    }
                });
                let data = AccessTokenRequest.data;
                if (data.access_token) {
                    localStorage.setItem("zalo_access_token", data.access_token);
                    return data.access_token;
                }
                return null;
            } else {
            throw new Error("ZALO_SECRET_KEY or ZALO_REFRESH_TOKEN is not set");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Expose file verify Zalo ở root path:
// GET https://<domain>/zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html
// app.get(
//     '/zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html',
//     (req, res) => {
//       const filePath = path.join(
//         __dirname,
//         'domain',
//         'zalo',
//         'zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html'
//       );
//       res.sendFile(filePath, (err) => {
//         if (err) {
//           console.error('Lỗi khi gửi file verify Zalo từ app.ts:', err);
//           if (!res.headersSent) {
//             res.status(500).send('Internal Server Error');
//           }
//         }
//       });
//     }
//   );


export const zaloController = {
    RecieveWebhook,
    verify,
};


// "params": [
//         {
//             "type": "1",
//             "name": "name",
//             "sample_value": "nguyen van A"
//         },
//         {
//             "type": "11",
//             "name": "order_code",
//             "sample_value": "ABC123"
//         },
//         {
//             "type": "15",
//             "name": "phone_number",
//             "sample_value": "0123456789"
//         },
//         {
//             "type": "18",
//             "name": "price",
//             "sample_value": "100000"
//         },
//         {
//             "type": "14",
//             "name": "status",
//             "sample_value": "DONE"
//         },
//         {
//             "type": "19",
//             "name": "date",
//             "sample_value": "19/01/1999"
//         }
//     ]


//     {
//         "ky": "1",
//         "thang": "4/2020",
//         "start_date": "20/03/2020",
//         "end_date": "20/04/2020",
//         "customer": "Nguyễn Thị Hoàng Anh",
//         "cid": "PE010299485",
//         "address": "VNG Campus, TP.HCM",
//         "amount": "100",
//         "total": "100000",
//      }
// {
//     "header": {
//         "components": [
//             {
//                 "IMAGES": {
//                     "items": [
//                         {
//                             "type": "IMAGE",
//                             "media_id": "celebration-banner.png"
//                         },
//                     ]
//                 }
//             },
//         ]
//     },
//     "body": {
//         "components": [
//             {
//                 "TITLE": {
//                     "value": "Quý khách nhận được lời chúc từ người thân"
//                 }
//             },
//             {
//                 "PARAGRAPH": {
//                     "value": "Người thân tên <from_name> gửi đến bạn lời chúc sau:"
//                 }
//             },
//             {
//                 "TABLE": {
//                     "rows": [
//                         {
//                             "value": "<from_name>",
//                             "title": "Người gửi",
//                             "row_type": 1
//                         },
//                         {
//                             "value": "<order>",
//                             "title": "Thứ tự"
//                         },
//                     ]
//                 },
//                 {
//                     "PARAGRAPH": {
//                         "value": "Lời chúc: <message>"
//                     }
//                 },
//             },
//         ]
//     },
//     "footer": {
//         "components": [
//             {
//                 "BUTTONS": {
//                     "items": [
//                         {
//                             "content": "https://zalo.me/1868947362941315995",
//                             "type": 1,
//                             "title": "Đến Creativ"
//                         }
//                     ]
//                 }
//             }
//         ]
//     }
// }