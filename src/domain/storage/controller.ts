import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { wrapAsync } from "../../util/wrapAsync";
import ioCustom from "../../util/ioCustom";
import { uploadImageBufferToPublicUrl } from "../../services/storage/cloudStorage.service";

export const uploadToCloud = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file?.buffer) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ioCustom.toResponseError({
          code: StatusCodes.BAD_REQUEST,
          message: "Thiếu file ảnh. Gửi multipart field tên `image`.",
        })
      );
    return;
  }

  const url = await uploadImageBufferToPublicUrl(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  res.status(StatusCodes.OK).json(
    ioCustom.toResponse(StatusCodes.OK, "Upload thành công", { url })
  );
});
