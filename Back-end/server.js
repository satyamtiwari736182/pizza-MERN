import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import path from "path";
import express, { json } from "express";
const app = express();

//DataBase connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "Database Connection error occured...")
);
connection
  .once("open", () => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log("DataBase Connection failed: ", err);
  });
/*----------------------------------------------*/

global.appRoot = path.resolve(__dirname);

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(json());
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

//server
app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
