import pharmacyRouter from "./routes/pharmacy";
import productRouter from "./routes/product";
import serverRouter from "./routes/server";
import stockRouter from "./routes/stock";
import userRouter from "./routes/user";
import app from "./server";

app.use("/user", userRouter);

app.use("/product", productRouter);

app.use("/server", serverRouter);

app.use("/pharmacy", pharmacyRouter);

app.use("/stock", stockRouter);
