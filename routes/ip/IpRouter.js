import { Router } from "express";
import IPController from "../../controllers/ip/ip.js";

const IPRouter = Router();

IPRouter.route("/").post(IPController.addHistory);
IPRouter.route("/:user_id").get(IPController.getHistoryByUserId);

export default IPRouter;
