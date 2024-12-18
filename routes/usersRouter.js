import express from "express";
import userController from "../controllers/usersController.js";
import { auth, upLoad } from "../middleware/index.js";
import {
  signinSchema,
  signupSchema,
  verifySchema,
} from "../schemas/userSchema.js";
import { validateBody } from "../helpers/index.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  upLoad.single("avatarURL"),
  validateBody(signinSchema),
  userController.signup
);
userRouter.post("/login", validateBody(signupSchema), userController.signin);
userRouter.post("/logout", auth, userController.logout);
userRouter.post("/current", auth, userController.current);
userRouter.get("/verify/:verificationToken", userController.verify);
userRouter.post("/verify", validateBody(verifySchema), userController.reVerify);

export default userRouter;
