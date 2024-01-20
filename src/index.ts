import express, { json } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import router from "./routers/index.js";
import handleErrorsMiddleware from "./middlewares/handleErrorsMiddleware.js";

dotenv.config();

const app = express();

app.use(json());
app.use(router);
app.use(handleErrorsMiddleware)

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Mode: ${process.env.MODE || "DEV"}`);
  console.log(`Server is up on port: ${port}`);
});