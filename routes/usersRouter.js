import express from "express";
import userController from "../controllers/userController.js";
import usersSchema from "../schemas/usersSchema.js";
import { authenticated, upload } from "../middlewares/index.js";
import { validateBody } from "../helpers/index.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody(usersSchema.signupSchema),
  userController.signup
);
usersRouter.patch(
  "/avatars",
  authenticated,
  upload.single("avatarURL"),
  userController.avatarChange
);
usersRouter.post(
  "/login",
  validateBody(usersSchema.signinSchema),
  userController.signin
);
usersRouter.post("/logout", authenticated, userController.logout);
usersRouter.get("/current", authenticated, userController.current);

export default usersRouter;
