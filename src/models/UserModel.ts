import { NewUser, user } from "../db/schema";
import { BaseModelService } from "./base/BaseModel";

export const userModal = new BaseModelService<typeof user, NewUser>(user);
