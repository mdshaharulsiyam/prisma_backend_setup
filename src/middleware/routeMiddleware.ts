import express, { Express, Request, Response } from "express";
import path from "path";

import { sendMail } from '../utils/sendMail';
import asyncWrapper from "./asyncWrapper";

export const routeMiddleware = (app: Express) => {
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

  app.post(
    "/send-email",
    asyncWrapper(async (req: Request, res: Response) => {
      const { receiver, name, question } = req.body;

      if (!receiver || !name || !question)
        throw new Error("All fields are required");

      const result = await sendMail.sendQuestionMail(receiver, name, question);
      console.log(result);
      res.status(200).send({
        success: true,
        message: "Contact Email sent successfully",
      });
    }),
  );


};
