import { column, NewColumn } from "../db/schema";
import { BaseModelService } from "./base/BaseModel";

export const columnModel = new BaseModelService<typeof column, NewColumn>(column);
