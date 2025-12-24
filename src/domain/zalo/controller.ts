import { wrapAsync } from "../../middleware/wrapAsync";
import { Request, Response } from "express";
import path from "path";

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