import userRouter from "./routes/User";
import app from "./server";

app.use("/user", userRouter);
