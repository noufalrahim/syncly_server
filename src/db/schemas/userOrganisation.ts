import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./user";
import { organisation } from "./organisation";

export const userOrganisation = pgTable("user_organisation", {
    userId: integer("user_id").notNull().references(() => user.id),
    organisationId: integer("organisation_id").notNull().references(() => organisation.id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organisationId] }),
  }));
  