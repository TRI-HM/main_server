import multer from "multer";

const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh"));
  }
};

/** Multer lưu file trong memory (buffer) — dùng trước khi upload cloud. */
export const uploadImageMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1080 * 1920 },
  fileFilter: imageFilter,
});
