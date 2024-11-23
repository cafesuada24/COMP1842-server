import express from "express";
import router from "./features/auth/auth.routes.js";
import { connectDB } from "./config/database.js";
await connectDB();

const app = express();
app.use(express.json())

app.use('/api/auth', router);
//export default app;
app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`)
})
