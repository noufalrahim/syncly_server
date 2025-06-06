import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { organisation } from "./organisation";

export const project = pgTable("project", {
    id: uuid("id").primaryKey().defaultRandom(),
    organisationId: uuid("organisation_id").references(() => organisation.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;