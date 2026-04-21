import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userRouter from "./users/user.route";
import sourceRouter from "./sources/source.route";
import categoryRouter from "./categories/category.route";
import articleRouter from "./articles/article.route";
import authRouter from "./auth/auth.route";
import publicRouter from "./public";
import feedsRouter from "./feeds/feeds.route";
import redirectUrlRouter from "./redirect-urls/redirect-url.route";
import statsRouter from "./stats/stats.route";

const router: IRouter = Router();

const routes = [
  {
    path: "/health",
    route: healthRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/sources",
    route: sourceRouter,
  },
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/articles",
    route: articleRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/public",
    route: publicRouter,
  },
  {
    path: "/feeds",
    route: feedsRouter,
  },
  {
    path: "/redirect-urls",
    route: redirectUrlRouter,
  },
  {
    path: "/stats",
    route: statsRouter,
  },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
