import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casesTable = pgTable("cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  nickname: text("nickname").notNull(),
  state: text("state").notNull().default(""),
  county: text("county").notNull().default(""),
  courtName: text("court_name").notNull().default(""),
  caseType: text("case_type").notNull().default(""),
  hearingDate: text("hearing_date").notNull().default(""),
  isRepresented: boolean("is_represented").notNull().default(false),
  attorneyName: text("attorney_name").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof casesTable.$inferSelect;
