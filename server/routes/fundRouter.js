import { Router } from "express";
import auth from "../middleware/auth.js";
import { createFund, deleteFund, getFunds, updateFund } from "../controllers/fund.js";

const fundRouter = Router();

fundRouter.get("/", getFunds);
fundRouter.post("/", auth, createFund);
fundRouter.patch(
  '/:fundId',
  auth,
  updateFund
);
fundRouter.delete(
  '/:fundId',
  auth,
  deleteFund
);

export default fundRouter;
