import { NextFunction, Request, Response } from "express";
import { UnlinkFiles } from "./fileUploader";

const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((error) => {
      if (req.body?.all_images?.length > 0) {
        UnlinkFiles(req.body?.all_images);
      }
      // globalErrorHandler(error, req, res, next);
      console.log(error);
    });
  };
};

export default asyncWrapper;
