import BaseController from "./base/BaseController";
import { columnModel } from "../models";
import { column } from "../db/schema";

export const columnController = new BaseController(columnModel, column);
