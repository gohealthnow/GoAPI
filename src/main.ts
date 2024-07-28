import userRouter from "./routes/user";
import app from "./server";

app.use("/user", userRouter);
