import express from "express";
import authRouter from "./features/auth/authRoutes";
const app = express();

app.use('/api/auth', authRouter);
module.exports = app;
