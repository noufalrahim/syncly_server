import BaseController from "./base/BaseController";
import { userModal } from "../models";
import { user } from "../db/schema";

export const userController = new BaseController(userModal, user);
