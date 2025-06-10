import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";
import { column } from "./column";

export const task = pgTable("task", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    projectId: uuid("project_id").references(() => project.id, { onDelete: 'cascade' }),
    columnId: uuid("column_id").references(() => column.id, { onDelete: 'cascade' }).notNull(),
    priority: text("priority").default('very_high'),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;