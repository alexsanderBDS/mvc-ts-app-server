import express from "express";
import userRoute from "./routes/userRoute";
import itemRoute from "./routes/itemRoute";
import authRoute from "./routes/authRoute";
import cookieParser from "cookie-parser";

const app = express();

const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/users", userRoute);
app.use("/itens", itemRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log("running server");
});
