import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import type { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { JoinType } from "../../types";

export class BaseModelService<
  TTable extends PgTable<TableConfig>,
  TInsert extends { id?: string | number }
> {

  constructor(private table: TTable) { }
  findAll = async () => {
    return await db.select().from(this.table as any);
  };

  findById = async (id: string | number) => {
    const [item] = await db
      .select()
      .from(this.table as any)
      .where(eq((this.table as any).id, id));
    return item || null;
  };

  create = async (data: TInsert) => {
    const resultArray = await db.insert(this.table as any).values(data).returning();
    const result = Array.isArray(resultArray) ? resultArray[0] : null;
    return result;
  };

  createMany = async (data: TInsert[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array");
    }
    const result = await db.insert(this.table as any).values(data).returning();
    return result;
  };

  updateById = async (id: string, data: TInsert) => {
    if (!data.id) throw new Error("ID is required");
    const [result] = await db
      .update(this.table as any)
      .set(data)
      .where(eq((this.table as any).id, data.id))
      .returning();
    return result;
  };

  delete = async (id: string | number) => {
    if (!id) throw new Error("ID is required");
    await db.delete(this.table as any).where(eq((this.table as any).id, id));
  };


  findAllByField = async (filter: any, joinOptions?: JoinType[]) => {
    let query: any = db.select().from(this.table as any);

    if (joinOptions) {
      for (const join of joinOptions) {
        query = query.leftJoin(
          join.table,
          join.on(this.table, join.table)
        );
      }
    }

    const result = await query.where(filter);
    return result.length > 0 ? result : null;
  };

  findAllByFields = async (
    filter?: any,
    joinOptions: JoinType[] = [],
    orderBy?: { column: any; direction: "asc" | "desc" }
  ) => {
    let query: any = db.select().from(this.table as any);
  
    for (const join of joinOptions) {
      const source = join.fromTable || this.table;
      query = query.leftJoin(join.table, join.on(source, join.table));
    }
  
    if (filter) {
      query = query.where(filter);
    }
  
    if (orderBy?.column) {
      query =
        orderBy.direction === "desc"
          ? query.orderBy(desc(orderBy.column))
          : query.orderBy(asc(orderBy.column));
    }
  
    const result = await query;
    return result.length > 0 ? result : null;
  };

}

