import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { organisation } from "./organisation";
import { user } from "./user";

export const userOrganisation = pgTable("user_organisation", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => user.id, { onDelete: 'cascade' }),
    organisationId: uuid("organisation_id").references(() => organisation.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserOrganisation = typeof userOrganisation.$inferSelect;
export type NewUserOrganisation = typeof userOrganisation.$inferInsert;