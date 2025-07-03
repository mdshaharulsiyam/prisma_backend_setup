import { NextFunction, Request, Response } from "express";
import fs from "fs";
import multer, { StorageEngine } from "multer";
import path from "path";

export const UnlinkFiles = (files: string[]) => {
  files.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    });
  });
};

const ensureDirectoryExists = async (directory: string) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const setFilePermissions = async (filePath: string) => {
  try {
    fs.chmodSync(filePath, 0o777);
  } catch (err) {
    console.error(`Error setting permissions for file: ${filePath}`, err);
  }
};

const uploadFile = async () => {
  await setFilePermissions(path.join("uploads"));
  const storage: StorageEngine = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const uploadPath = path.join("uploads", file.fieldname);
        await ensureDirectoryExists(uploadPath);
        if (
          file.mimetype.startsWith("image/") ||
          file.mimetype.startsWith("video/")
        ) {
          cb(null, uploadPath);
        } else {
          cb(new Error("Invalid file type"), "");
        }
      } catch (error) {
        cb(error as Error, "");
      }
    },
    filename: async (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      const filePath = path.join("uploads", file.fieldname, name);
      await ensureDirectoryExists(path.dirname(filePath));
      // setFilePermissions(path.join('uploads'));
      cb(null, name);
    },
  });

  const fileFilter = async (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowedFilenames = [
      "img",
      "video",
      "logo",
      "documents",
      "business_documents",
      "banner",
    ];
    if (allowedFilenames.includes(file.fieldname)) {
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    } else {
      cb(new Error("Invalid field name"));
    }
  };

  const maxVideoLength = 20;

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: "img", maxCount: 4 },
    { name: "video", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "documents", maxCount: 2 },
    { name: "business_documents", maxCount: 3 },
    { name: "banner", maxCount: 1 },
  ]);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ success: false, message: err.message });
      }

      // Type assertion to handle the 'video' field properly
      const files = req.files as { [key: string]: Express.Multer.File[] }; //  { [fieldname: string]: Express.Multer.File[] };

      // Video size validation (if necessary)
      if (files?.video) {
        const videoFiles = files.video;
        const fileSizeMB = videoFiles[0].size / (1024 * 1024);
        if (fileSizeMB > maxVideoLength) {
          UnlinkFiles([videoFiles[0].path]);
          return res
            .status(400)
            .send({ success: false, message: "Max video length is 20 MB" });
        }
      }

      next();
    });
  };
};

export default uploadFile;
