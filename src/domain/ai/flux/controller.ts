import { Request, Response } from "express";
import { wrapAsync } from "../../../util/wrapAsync";
import ioCustom from "../../../util/ioCustom";
import { StatusCodes } from "http-status-codes";
import { uploadImageBufferToPublicUrl } from "../../../services/storage/cloudStorage.service";
import {
  downloadImageAsBuffer,
  runFluxKontext,
} from "../../../services/ai/flux/piapiKontext.service";

export const test_textToImage = wrapAsync(async (req: Request, res: Response) => {
  console.log("Client request: ", req.body);
  try {
    res.status(200).json(ioCustom.toResponse(StatusCodes.OK, "Image generated successfully"));
  } catch (error) {
    throw new Error("Failed to generate image");
  }
});

export const kontextToImage = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!file?.buffer) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ioCustom.toResponseError({
          code: StatusCodes.BAD_REQUEST,
          message: "Thiếu ảnh. Gửi multipart field tên `image`.",
        })
      );
    return;
  }

  if (!prompt) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ioCustom.toResponseError({
          code: StatusCodes.BAD_REQUEST,
          message: "Thiếu prompt (field text `prompt`).",
        })
      );
    return;
  }

  const width = req.body?.width !== undefined ? Number(req.body.width) : undefined;
  const height = req.body?.height !== undefined ? Number(req.body.height) : undefined;
  const steps = req.body?.steps !== undefined ? Number(req.body.steps) : undefined;

  const sourceImageUrl = await uploadImageBufferToPublicUrl(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  const fluxImageUrl = await runFluxKontext({
    imageUrl: sourceImageUrl,
    prompt,
    width: Number.isFinite(width) ? width : undefined,
    height: Number.isFinite(height) ? height : undefined,
    steps: Number.isFinite(steps) ? steps : undefined,
  });

  const generatedBuffer = await downloadImageAsBuffer(fluxImageUrl);
  const generatedImageUrl = await uploadImageBufferToPublicUrl(
    generatedBuffer,
    `flux-kontext-${Date.now()}.png`,
    "image/png"
  );

  res.status(200).json(
    ioCustom.toResponse(StatusCodes.OK, "Tạo ảnh thành công", {
      sourceImageUrl,
      fluxOutputUrl: fluxImageUrl,
      generatedImageUrl,
    })
  );
});
