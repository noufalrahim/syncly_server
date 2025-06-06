import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import dotenv from "dotenv";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { SignupBodyType } from "../types";
import { user } from "../db/schema";

dotenv.config();

export interface AuthRequest extends Request {
    user?: string;
    token?: string;
    loggedInUser?: SignupBodyType;
};

export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) : Promise<void> => {
    try {
        const token = req.header("x-auth-token");
        if(!token) {
            res.status(400).json({error: "No token provided"});
            return;
        }

        const secretKey = process.env.JWT_SECRET;

        if(!secretKey) {
            res.status(500).json({error: "An unknown error occured!"});
            return;
        }

        const verified = jwt.verify(token, secretKey);

        if (!verified || typeof verified !== "object" || !("id" in verified)) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        const verifiedToken = verified as { id: string };

        const [userData] = await db.select().from(user).where(eq(user.id, verifiedToken.id));

        req.user = verifiedToken.id;

        if(userData) {
            req.token = token;
            req.loggedInUser = userData;
        }
        else {
            res.status(401).json({error: "User not found"});
            return;
        }

        next();
    }
    catch (e) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}
