import { Router } from "express";
import UserController from "../../controllers/user/user.js";

const UserRouter = Router();

UserRouter.route("/login").post(UserController.login);
UserRouter.route("/logout").get(UserController.logout);
UserRouter.route("/").get(
  UserController.verifyUser,
  UserController.authenticateUser
);

export default UserRouter;
