import { TableConfig } from "drizzle-orm/pg-core";
import { PgTable } from "drizzle-orm/pg-core";

export type JoinType = {
  table: PgTable<TableConfig>;
  on: (base: any, join: any) => any;
  fromTable?: any;
};