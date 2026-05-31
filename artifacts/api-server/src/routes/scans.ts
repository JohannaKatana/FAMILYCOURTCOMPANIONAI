import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { communicationScansTable, casesTable, insertScanSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function verifyCaseOwner(caseId: string, userId: string): Promise<boolean> {
  const [c] = await db.select().from(casesTable).where(eq(casesTable.id, caseId));
  return !!c && c.userId === userId;
}

router.get("/cases/:caseId/scans", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    if (!await verifyCaseOwner(req.params.caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    const scans = await db.select().from(communicationScansTable)
      .where(eq(communicationScansTable.caseId, req.params.caseId));
    res.json(scans);
  } catch (err) {
    req.log.error(err, "GET /cases/:caseId/scans failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases/:caseId/scans", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    if (!await verifyCaseOwner(req.params.caseId, userId)) { res.status(404).json({ error: "Not found" }); return; }
    const parsed = insertScanSchema.safeParse({ ...req.body, caseId: req.params.caseId });
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
    const [created] = await db.insert(communicationScansTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err, "POST /cases/:caseId/scans failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
