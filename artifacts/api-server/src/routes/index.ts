import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userRouter from "./users/user.route";
import sourceRouter from "./sources/source.route";
import categoryRouter from "./categories/category.route";
import articleRouter from "./articles/article.route";
import authRouter from "./auth/auth.route";

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
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
