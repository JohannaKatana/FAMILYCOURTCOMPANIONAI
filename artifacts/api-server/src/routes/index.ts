import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import casesRouter from "./cases";
import evidenceRouter from "./evidence";
import scansRouter from "./scans";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(casesRouter);
router.use(evidenceRouter);
router.use(scansRouter);

export default router;
