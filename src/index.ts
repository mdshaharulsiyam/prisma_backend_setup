import express from "express";
import authRoute from "./apis/auth/auth_route";
import categoryRouter from './apis/category/category_route';
import globalErrorHandler from './utils/globalErrorHandler';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoute);
app.use(categoryRouter);

app.get("/", (req, res) => {
  res.send("Hello Prisma!");
});
app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});