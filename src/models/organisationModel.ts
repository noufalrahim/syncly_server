import { NewOrganisation, organisation } from "../db/schema";
import { BaseModelService } from "./base/BaseModel";

export const organisationModel = new BaseModelService<typeof organisation, NewOrganisation>(organisation);
