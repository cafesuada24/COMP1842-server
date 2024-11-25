import express from "express";

import authRouter from "./features/auth/auth.routes.js";
import userRouter from "./features/user/user.routes.js";
import incomeCategoryRouter from "./features/income/income-category.routes.js";
import incomeRouter from "./features/income/income.routes.js";
import expenseRouter from "./features/expense/expense.routes.js";
import { connectDB } from "./config/database.js";

await connectDB();

const app = express();
app.use(express.json())

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/income/', incomeRouter);
app.use('/api/income/category', incomeCategoryRouter);
app.use('/api/expense/', expenseRouter);

//export default app;
app.listen(process.env.PORT, () => {
  console.log(`App is listening at http://localhost:${process.env.PORT}`)
})
