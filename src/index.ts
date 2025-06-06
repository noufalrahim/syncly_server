import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index';
import authRouter from './routes/authRouter';
import { auth } from './middlewares/auth';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api", auth, router);

app.get("/", (req, res) => {
    res.send("Welcome To Syncly Server");
});

app.listen(8000, () => {
    console.log("Sever started on port 8000");
});

