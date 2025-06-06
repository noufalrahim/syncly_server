import { NewProject, project } from "../db/schema";
import { BaseModelService } from "./base/BaseModel";

export const projectModal = new BaseModelService<typeof project, NewProject>(project);
