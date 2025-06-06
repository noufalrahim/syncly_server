import { Request, Response } from 'express';
import { SignupBodyType } from '../types';
import jwt from "jsonwebtoken";
import { eq } from 'drizzle-orm';
import { user } from '../db/schema';
import { userModal } from '../models';

export const signUp = async (req: Request<{}, {}, SignupBodyType>, res: Response) => {
    try {
        const result = await userModal.findAllByField(eq(user.mobile, req.body.mobile));
        const existingUser = Array.isArray(result) ? result[0] : undefined;
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        };

        const userCreateResp = await userModal.create(req.body);
        res.status(201).json(userCreateResp);
        return;
    }
    catch (e) {
        res.status(500).json({ error: `An unkown error occured! ${e}` });
    }
};

export const login = async (req: Request<{}, {}, { mobile: string }>, res: Response) => {
    try {
        const result = await userModal.findAllByField(eq(user.mobile, req.body.mobile));
        const existingUser = Array.isArray(result) ? result[0] : undefined;
        if (!existingUser) {
            res.status(400).json({ error: "User does not exist" });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({ error: "An unkown error occured! no jwt found" });
            return;
        };

        const token = jwt.sign({ id: existingUser.id }, jwtSecret);

        res.json({
            ...existingUser,
            token,
        });

        return;
    }
    catch (e) {
        res.status(500).json({ error: `An unkown error occured! ${e}` });
        return;
    }
};