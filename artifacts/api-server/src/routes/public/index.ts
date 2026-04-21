import { Router, type IRouter } from "express";
import articlesRouter from "./articles.route";
import categoriesRouter from "./categories.route";
import feedsRouter from "./feeds.route";

const router: IRouter = Router();

router.use("/articles", articlesRouter);
router.use("/categories", categoriesRouter);
router.use("/feeds", feedsRouter);

export default router;
