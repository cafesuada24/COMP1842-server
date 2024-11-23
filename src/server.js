import express from "express";
import router from "./features/auth/authRoutes.js";
const app = express();

app.use('/api/auth', router);
export default app;
