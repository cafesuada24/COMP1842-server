import express from "express";
import router from "./features/auth/authRoutes.js";
import { connectDB } from "./config/dbConfig.js";
await connectDB();

const app = express();

app.use('/api/auth', router);
//export default app;
app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`)
})
