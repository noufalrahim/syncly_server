import { Request, Response } from "express";
import { JoinType } from "../../types";
import { eq, gt, gte, lt, lte, like, and, between, or, sql, not } from 'drizzle-orm';
import flattenQuery from "../../utils/flattenQuery";

interface BaseModel {
    findAll: () => Promise<any[]>;
    findById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    createMany: (data: any[]) => Promise<any>;
    updateById: (id: string, data: any, options?: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    findAllByField?: (filter: Record<string, any>, joins?: JoinType[]) => Promise<any>;
    findAllByFields?: any
}

export default class BaseController<T extends BaseModel> {
    private model: T;
    private table: any;
    private joins?: JoinType[]

    constructor(model: T, table: any, joins?: JoinType[]) {
        this.model = model;
        this.table = table;
        this.joins = joins ?? [];
    }

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.model.findAll();
            res.json(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.model.findById(req.params.id);
            if (!data) return res.status(200).json();
            res.json(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const parsedBody: Record<string, any> = { ...req.body };

            for (const key in parsedBody) {
                if (
                    typeof parsedBody[key] === "string" &&
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(parsedBody[key])
                ) {
                    parsedBody[key] = new Date(parsedBody[key]);
                }
            }

            const newItem = await this.model.create(parsedBody);
            res.status(201).json(newItem);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    createMany = async (req: Request, res: Response) => {
        try {
            if (!this.model.createMany) {
                return res.status(501).json({ error: "createMany not implemented" });
            }

            const parsedBody: Record<string, any>[] = Array.isArray(req.body) ? [...req.body] : [];

            parsedBody.forEach((item) => {
                for (const key in item) {
                    if (
                        typeof item[key] === "string" &&
                        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(item[key])
                    ) {
                        item[key] = new Date(item[key]);
                    }
                }
            });

            const result = await this.model.createMany(parsedBody);
            res.status(201).json(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const parsedBody: Record<string, any> = { ...req.body };

            for (const key in parsedBody) {
                if (
                    typeof parsedBody[key] === "string" &&
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(parsedBody[key])
                ) {
                    parsedBody[key] = new Date(parsedBody[key]);
                }
            }

            const updated = await this.model.updateById(req.params.id, parsedBody, { new: true });
            res.json(updated);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };


    delete = async (req: Request, res: Response) => {
        try {
            await this.model.delete(req.params.id);
            res.status(204).end();
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    getByField = async (req: Request, res: Response) => {
        const { field, value } = req.params;

        if (!value) {
            res.status(200).json();
            return;
        }

        if (!this.model.findAllByField) {
            return res.status(501).json({ error: "findAllByField not implemented" });
        }

        if (!this.table || !this.table[field]) {
            return res.status(400).json({ error: "Invalid table field" });
        }

        try {
            const filter = eq(this.table[field], value);
            if (this.joins && this.joins.length > 0) {
                const data = await this.model.findAllByField(filter, this.joins);
                if (!data) {
                    res.status(200).json()
                    return;
                };
                res.json(data);
                return;
            }
            const data = await this.model.findAllByField(filter);
            if (!data) {
                res.status(200).json()
                return;
            };
            res.json(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    };

    getByFields = async (req: Request, res: Response) => {
        const rawQuery = { ...req.query };
        const queryFields = flattenQuery(rawQuery);
    
        const mode = queryFields._mode === "or" ? "or" : "and";
        delete queryFields._mode;
    
        const orderByField = queryFields._order_by;
        const orderDirection = (Array.isArray(queryFields._order_dir) ? queryFields._order_dir[0] : queryFields._order_dir || 'asc').toLowerCase();
        delete queryFields._order_by;
        delete queryFields._order_dir;
    
        // Check if any real filters are present (ignore _ prefixed fields)
        const hasFilterFields = Object.keys(queryFields).some(key => !key.startsWith('_'));
    
        if (!this.model.findAllByFields) {
            return res.status(501).json({ error: "findAllByFields not implemented" });
        }
    
        const filters: any[] = [];
    
        for (const key in queryFields) {
            const raw = queryFields[key];
            const values = Array.isArray(raw) ? raw : [raw];
    
            const match = key.match(/^([^\[\]]+)(?:\[(\w+)\])?$/);
            if (!match) continue;
    
            const [, field, operator] = match;
    
            if (!this.table[field]) {
                return res.status(400).json({ error: `Invalid field: ${field}` });
            }
    
            const column = this.table[field];
    
            const parsedValues = values.map((val: any) => {
                if (
                    typeof val === 'string' &&
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(val)
                ) {
                    const d = new Date(val);
                    return isNaN(d.getTime()) ? val : d;
                }
                return val;
            });
    
            if (parsedValues.some(v => typeof v === 'object' && !(v instanceof Date))) {
                return res.status(400).json({ error: `Invalid value for field ${key}` });
            }
    
            switch (operator) {
                case "gt":
                    filters.push(...parsedValues.map(v => gt(column, v)));
                    break;
                case "gte":
                    filters.push(...parsedValues.map(v => gte(column, v)));
                    break;
                case "lt":
                    filters.push(...parsedValues.map(v => lt(column, v)));
                    break;
                case "lte":
                    filters.push(...parsedValues.map(v => lte(column, v)));
                    break;
                case "like":
                    filters.push(...parsedValues.map(v =>
                        like(sql`LOWER(${column})`, `%${String(v).toLowerCase()}%`)
                    ));
                    break;
                case "between":
                    if (parsedValues.length === 2) {
                        filters.push(between(column, parsedValues[0], parsedValues[1]));
                    } else {
                        return res.status(400).json({ error: `Field ${field}[between] requires exactly 2 values` });
                    }
                    break;
                case "ne":
                case "not":
                    filters.push(...parsedValues.map(v => not(eq(column, v))));
                    break;
                default:
                    if (parsedValues.length === 1) {
                        filters.push(eq(column, parsedValues[0]));
                    } else {
                        filters.push(or(...parsedValues.map(v => eq(column, v))));
                    }
            }
        }
    
        let orderBy: any = undefined;
        if (orderByField) {
            if (Array.isArray(orderByField) || !this.table[orderByField]) {
                return res.status(400).json({ error: `Invalid order_by field: ${orderByField}` });
            }
    
            orderBy = {
                column: this.table[orderByField],
                direction: orderDirection === "desc" ? "desc" : "asc",
            };
        }
    
        try {
            const whereClause = hasFilterFields
                ? (mode === "or" ? or(...filters) : and(...filters))
                : undefined;
    
            const data = this.joins?.length
                ? await this.model.findAllByFields(whereClause, this.joins, orderBy)
                : await this.model.findAllByFields(whereClause, [], orderBy);
    
            res.status(200).json(data ?? []);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: err?.message || "Unknown error" });
        }
    };
    
    
}