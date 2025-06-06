import { NewTask, task } from "../db/schema";
import { BaseModelService } from "./base/BaseModel";

export const taskModal = new BaseModelService<typeof task, NewTask>(task);
