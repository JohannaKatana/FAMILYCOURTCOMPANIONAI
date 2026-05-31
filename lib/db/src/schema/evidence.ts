import { pgTable, text, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const evidenceTable = pgTable("evidence_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  directQuote: text("direct_quote").notNull().default(""),
  witnesses: jsonb("witnesses").$type<string[]>().notNull().default([]),
  factorTags: jsonb("factor_tags").$type<string[]>().notNull().default([]),
  strengthScore: integer("strength_score").notNull().default(5),
  confidenceScore: integer("confidence_score").notNull().default(50),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEvidenceSchema = createInsertSchema(evidenceTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidenceTable.$inferSelect;
