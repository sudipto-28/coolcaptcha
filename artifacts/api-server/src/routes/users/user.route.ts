import { db, usersTable } from "@workspace/db";
import { Router, type IRouter } from "express";
const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const users = await db.select().from(usersTable);

  res.json({ message: "Users endpoint1", users });
});

export default router;
