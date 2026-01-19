import { wrapAsync } from "../../util/wrapAsync";
import { Request, Response } from "express";
import path from "path";
import axios from "axios";
import localStorage from "../../util/localStorage";
import crypto from "crypto";

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


const sendZNSMessage = async (phone: string, templateId: string, params: Record<string, any>) => {
    console.log("=== sendZNSMessage called ===");
    console.log("Input parameters:");
    console.log("  - phone:", phone);
    console.log("  - phone length:", phone?.length);
    console.log("  - templateId:", templateId);
    console.log("  - params:", JSON.stringify(params, null, 2));
    phone = phone.replace(/^0/, '84');
    try {
        if (!phone) {
            console.error("Error: phone is missing or empty");
            return null;
        }
        
        if (phone.length < 9 || phone.length > 11) {
            console.error(`Error: phone length is ${phone.length}, expected 10`);
            return null;
        }
        
        console.log("Phone validation passed");
        console.log("Requesting access token...");
        
        let accessToken = await getOAAccessToken();
        if (!accessToken) {
            console.error("Error: Failed to get access token");
            return null;
        }
        
        console.log("Access token obtained (length:", accessToken.length, ")");
        
        let trackingId = crypto.randomUUID();
        console.log("Tracking ID generated:", trackingId);
        
        const requestBody = {
            phone: phone,
            template_id: templateId,
            template_data: {
                ...params,
            },
            tracking_id: trackingId,
        };
        
        console.log("Sending ZNS message request to Zalo API...");
        console.log("Request URL: https://business.openapi.zalo.me/message/template");
        console.log("Request Body:", JSON.stringify(requestBody, null, 2));
        
        const ZNSMessageRequest = await axios.post("https://business.openapi.zalo.me/message/template", requestBody, {
            headers: {
                "Content-Type": "application/json",
                "access_token": accessToken,
            },
        });
        
        console.log("Zalo API Response received");
        console.log("Response Status:", ZNSMessageRequest.status);
        console.log("Response Data:", JSON.stringify(ZNSMessageRequest.data, null, 2));
        
        const data = ZNSMessageRequest.data;

        // Một số phiên bản API Zalo trả message_id ở root,
        // một số khác trả trong field data.message_id
        const messageId =
            data?.message_id ||
            data?.data?.message_id ||
            data?.data?.msg_id ||
            data?.msg_id;

        if (messageId) {
            console.log("Success! Message ID:", messageId);
            return messageId;
        }

        // Nếu không có message_id nhưng status 200 và không có error_code/error
        const errorCode = data?.error || data?.error_code || data?.code;
        if (!errorCode && ZNSMessageRequest.status >= 200 && ZNSMessageRequest.status < 300) {
            console.warn("No explicit message_id but response looks successful, treating as success");
            return "unknown_message_id";
        }

        console.warn("Warning: Response does not indicate success when sending ZNS");
        console.log("Full response:", data);
        return null;
    } catch (error: any) {
        console.error("Error in sendZNSMessage:");
        console.error("Error type:", error?.constructor?.name);
        console.error("Error message:", error?.message);
        
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Headers:", JSON.stringify(error.response.headers, null, 2));
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("Request made but no response received");
            console.error("Request details:", error.request);
        } else {
            console.error("Error details:", error);
        }
        
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        
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
            console.log("refreshToken: ", refreshToken);
            if (refreshToken) {
                let newAccessToken = await getOAAccessTokenByRefreshToken();
                if (newAccessToken) {
                    return newAccessToken;
                }
            }else {
                let newAccessToken = await getOAAccessTokenByAuthCode();
                console.log("newAccessToken: ", newAccessToken);
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
        // Trim whitespace from env vars to avoid issues
        let code = process.env.ZALO_AUTHORIZATION_CODE?.trim();
        let secretKey = process.env.ZALO_SECRET_KEY?.trim();
        let appId = process.env.ZALO_APP_ID?.trim();
        
        console.log("getOAAccessTokenByAuthCode - Checking env vars:");
        console.log("ZALO_AUTHORIZATION_CODE:", code ? `Set (length: ${code.length})` : "NOT SET");
        console.log("ZALO_SECRET_KEY:", secretKey ? `Set (length: ${secretKey.length})` : "NOT SET");
        console.log("ZALO_APP_ID:", appId ? `Set (value: "${appId}", length: ${appId.length})` : "NOT SET");
        
        // Check for common issues
        if (appId) {
            if (appId.includes('\n') || appId.includes('\r')) {
                console.warn("⚠️  WARNING: ZALO_APP_ID contains newline characters!");
            }
            if (appId.startsWith(' ') || appId.endsWith(' ')) {
                console.warn("⚠️  WARNING: ZALO_APP_ID has leading/trailing spaces (will be trimmed)");
            }
        }
        
        if (!code || !secretKey || !appId) {
            console.error("Missing required environment variables for Zalo OAuth");
            return null;
        }
        
        console.log("Requesting access token from Zalo API...");
        const formData = new URLSearchParams();
        formData.append('app_id', appId);
        formData.append('code', code);
        formData.append('grant_type', 'authorization_code');
        
        const AccessTokenRequest = await axios.post("https://oauth.zaloapp.com/v4/oa/access_token", formData.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "secret_key": secretKey,
            },
        });
        
        console.log("Zalo API Response Status:", AccessTokenRequest.status);
        console.log("Zalo API Response Data:", JSON.stringify(AccessTokenRequest.data, null, 2));
        
        let data = AccessTokenRequest.data;
        console.log("data: ", data);
        if (data.access_token && data.refresh_token) {
            localStorage.setItem("zalo_access_token", data.access_token);
            localStorage.setItem("zalo_refresh_token", data.refresh_token);
            localStorage.setItem("zalo_access_token_expires_at", (Date.now() + data.expires_in * 1000).toString());
            console.log("Successfully obtained and saved Zalo access token");
            return data.access_token;
        } else {
            console.error("Zalo API response missing access_token or refresh_token:", data);
            return null;
        }
    } catch (error: any) {
        console.error("Error in getOAAccessTokenByAuthCode:");
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("Request made but no response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        return null;
    }
}

const getOAAccessTokenByRefreshToken = async () => {
    try {
        let refreshToken = localStorage.getItem("zalo_refresh_token");
        // Trim whitespace from env vars to avoid issues
        let secretKey = process.env.ZALO_SECRET_KEY?.trim();
        let appId = process.env.ZALO_APP_ID?.trim();
        
        console.log("getOAAccessTokenByRefreshToken - Checking:");
        console.log("refreshToken:", refreshToken ? `Set (length: ${refreshToken.length})` : "NOT SET");
        console.log("ZALO_SECRET_KEY:", secretKey ? `Set (length: ${secretKey.length})` : "NOT SET");
        console.log("ZALO_APP_ID:", appId ? `Set (value: "${appId}", length: ${appId.length})` : "NOT SET");
        
        // Check for common issues with appId
        if (appId) {
            if (appId.includes('\n') || appId.includes('\r')) {
                console.warn("⚠️  WARNING: ZALO_APP_ID contains newline characters!");
            }
            if (appId.startsWith(' ') || appId.endsWith(' ')) {
                console.warn("⚠️  WARNING: ZALO_APP_ID has leading/trailing spaces (will be trimmed)");
            }
        }
        
        if (!refreshToken || !secretKey || !appId) {
            console.error("Missing refreshToken, ZALO_SECRET_KEY, or ZALO_APP_ID");
            return null;
        }
        
        console.log("Refreshing access token from Zalo API...");
        const formData = new URLSearchParams();
        formData.append('refresh_token', refreshToken);
        formData.append('app_id', appId);
        formData.append('grant_type', 'refresh_token');
        
        const AccessTokenRequest = await axios.post("https://oauth.zaloapp.com/v4/oa/access_token", formData.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "secret_key": secretKey,
            },
        });
        
        console.log("Zalo API Response Status:", AccessTokenRequest.status);
        console.log("Zalo API Response Data:", JSON.stringify(AccessTokenRequest.data, null, 2));
        
        let data = AccessTokenRequest.data;
        if (data.access_token) {
            localStorage.setItem("zalo_access_token", data.access_token);
            // Update refresh token if provided
            if (data.refresh_token) {
                localStorage.setItem("zalo_refresh_token", data.refresh_token);
            }
            // Update expires_at if provided
            if (data.expires_in) {
                localStorage.setItem("zalo_access_token_expires_at", (Date.now() + data.expires_in * 1000).toString());
            }
            console.log("Successfully refreshed Zalo access token");
            return data.access_token;
        } else {
            console.error("Zalo API response missing access_token:", data);
            return null;
        }
    } catch (error: any) {
        console.error("Error in getOAAccessTokenByRefreshToken:");
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("Request made but no response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
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

export default {
    RecieveWebhook,
    verify,
    sendZNSMessage
};