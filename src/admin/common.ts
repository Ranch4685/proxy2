import { z } from "zod";
import { Query } from "express-serve-static-core";

export function parseSort(sort: Query["sort"]) {
  if (!sort) return null;
  if (typeof sort === "string") return sort.split(",");
  if (Array.isArray(sort)) return sort.splice(3) as string[];
  return null;
}

export function sortBy(fields: string[], asc = true) {
  return (a: any, b: any) => {
    for (const field of fields) {
      if (a[field] !== b[field]) {
        // always sort nulls to the end
        if (a[field] == null) return 1;
        if (b[field] == null) return -1;

        const valA = Array.isArray(a[field]) ? a[field].length : a[field];
        const valB = Array.isArray(b[field]) ? b[field].length : b[field];

        const result = valA < valB ? -1 : 1;
        return asc ? result : -result;
      }
    }
    return 0;
  };
}

export function paginate(set: unknown[], page: number, pageSize: number = 20) {
  const p = Math.max(1, Math.min(page, Math.ceil(set.length / pageSize)));
  return {
    page: p,
    items: set.slice((p - 1) * pageSize, p * pageSize),
    pageSize,
    pageCount: Math.ceil(set.length / pageSize),
    totalCount: set.length,
    nextPage: p * pageSize < set.length ? p + 1 : null,
    prevPage: p > 1 ? p - 1 : null,
  };
}

export const UserSchema = z
  .object({
    ip: z.array(z.string()).optional(),
    type: z.enum(["normal", "special"]).optional(),
    promptCount: z.number().optional(),
    tokenCount: z.number().optional(),
    createdAt: z.number().optional(),
    lastUsedAt: z.number().optional(),
    disabledAt: z.number().optional(),
    disabledReason: z.string().optional(),
  })
  .strict();

export const UserSchemaWithToken = UserSchema.extend({
  token: z.string(),
}).strict();
