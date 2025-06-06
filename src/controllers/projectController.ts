import BaseController from "./base/BaseController";
import { projectModal } from "../models";
import { organisation, project } from "../db/schema";
import { JoinType } from "../types";
import { eq } from "drizzle-orm";

const joinConstraints: JoinType[] = [
    {
        table: organisation,
        on: (project, organisation) =>
            eq(project.organisationId, organisation.id)
    }
];

export const projectController = new BaseController(projectModal, project, joinConstraints);
