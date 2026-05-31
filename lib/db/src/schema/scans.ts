import { pgTable, text, integer, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const communicationScansTable = pgTable("communication_scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull(),
  scanDate: timestamp("scan_date").notNull().defaultNow(),
  sourceDescription: text("source_description").notNull().default(""),
  messageCount: integer("message_count").notNull().default(0),
  evidenceCount: integer("evidence_count").notNull().default(0),
  results: jsonb("results").$type<object[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertScanSchema = createInsertSchema(communicationScansTable).omit({
  id: true,
  createdAt: true,
  scanDate: true,
});

export type InsertScan = z.infer<typeof insertScanSchema>;
export type CommunicationScan = typeof communicationScansTable.$inferSelect;
