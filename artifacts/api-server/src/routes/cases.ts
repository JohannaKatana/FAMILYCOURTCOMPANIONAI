import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { casesTable, insertCaseSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/cases", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const cases = await db.select().from(casesTable).where(eq(casesTable.userId, userId));
    res.json(cases);
  } catch (err) {
    req.log.error(err, "GET /cases failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const parsed = insertCaseSchema.safeParse({ ...req.body, userId });
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
    const [created] = await db.insert(casesTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err, "POST /cases failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cases/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const id = req.params["id"] as string;
    const [c] = await db.select().from(casesTable).where(eq(casesTable.id, id));
    if (!c || c.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }
    res.json(c);
  } catch (err) {
    req.log.error(err, "GET /cases/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cases/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const id = req.params["id"] as string;
    const [existing] = await db.select().from(casesTable).where(eq(casesTable.id, id));
    if (!existing || existing.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }
    const [updated] = await db.update(casesTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(casesTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err, "PUT /cases/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cases/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals["userId"] as string;
    const id = req.params["id"] as string;
    const [existing] = await db.select().from(casesTable).where(eq(casesTable.id, id));
    if (!existing || existing.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(casesTable).where(eq(casesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "DELETE /cases/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
