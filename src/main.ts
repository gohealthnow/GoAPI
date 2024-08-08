import productRouter from "./routes/product";
import serverRouter from "./routes/server";
import userRouter from "./routes/user";
import app from "./server";

app.use("/user", userRouter);

app.use("/product", productRouter);

app.use("/server", serverRouter);
