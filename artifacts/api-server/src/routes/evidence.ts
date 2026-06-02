import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { evidenceTable, casesTable, insertEvidenceSchema } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

async function verifyCaseOwner(caseId: string, userId: string): Promise<boolean> {
  const [c] = await db.select().from(casesTable).where(eq(casesTable.id, caseId));
  return !!c && c.userId === userId;
}

router.get("/cases/:caseId/evidence", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const caseId = req.params["caseId"] as string;
    if (!await verifyCaseOwner(caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    const entries = await db.select().from(evidenceTable).where(eq(evidenceTable.caseId, caseId));
    res.json(entries);
  } catch (err) {
    req.log.error(err, "GET /cases/:caseId/evidence failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases/:caseId/evidence", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const caseId = req.params["caseId"] as string;
    if (!await verifyCaseOwner(caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    const parsed = insertEvidenceSchema.safeParse({ ...req.body, caseId });
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
    const [created] = await db.insert(evidenceTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err, "POST /cases/:caseId/evidence failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cases/:caseId/evidence/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const caseId = req.params["caseId"] as string;
    const id = req.params["id"] as string;
    if (!await verifyCaseOwner(caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    const [updated] = await db.update(evidenceTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(and(eq(evidenceTable.id, id), eq(evidenceTable.caseId, caseId)))
      .returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err, "PUT /cases/:caseId/evidence/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cases/:caseId/evidence/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const caseId = req.params["caseId"] as string;
    const id = req.params["id"] as string;
    if (!await verifyCaseOwner(caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(evidenceTable)
      .where(and(eq(evidenceTable.id, id), eq(evidenceTable.caseId, caseId)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "DELETE /cases/:caseId/evidence/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
