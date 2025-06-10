import BaseController from "./base/BaseController";
import { taskModal } from "../models";
import { column, project, task } from "../db/schema";
import { JoinType } from "../types";
import { eq } from "drizzle-orm";

const joinConstraints: JoinType[] = [
    {
        table: project,
        on: (task, project) =>
            eq(task.projectId, project.id)
    },
    {
        table: column,
        on: (task, column) => 
            eq(task.columnId, column.id)
    }
];

export const taskController = new BaseController(taskModal, task, joinConstraints);
