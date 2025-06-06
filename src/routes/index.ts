import express from 'express';
import authRouter from './authRouter';
import { organisationRouter } from './organisationRouter';
import { projectRouter } from './projectRouter';
import { taskRouter } from './taskRouter';
import { userRouter } from './userRouter';
import { columnRouter } from './columnRouter';

const router = express.Router();

router.use("/auth", authRouter);
router.use("/organisations", organisationRouter);
router.use("/projects", projectRouter);
router.use("/tasks", taskRouter);
router.use("/users", userRouter);
router.use("/columns", columnRouter);


export default router;
