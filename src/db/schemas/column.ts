import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";

export const column = pgTable("column", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => project.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Column = typeof column.$inferSelect;
export type NewColumn = typeof column.$inferInsert;