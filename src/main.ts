import serverRouter from "./routes/server";
import userRouter from "./routes/user";
import app from "./server";

app.use("/user", userRouter);

app.use("/server", serverRouter);
