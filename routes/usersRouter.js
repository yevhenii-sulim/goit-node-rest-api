import express from "express";
import usersController from "../controllers/usersController.js";
import usersSchema from "../schemas/usersSchema.js";
import validateBody from "../helpers/validateBody.js";
import authentificate from "../middleWears/authentificate.js";

const usersRouter = express.Router();

usersRouter.post(
	"/login",
	validateBody(usersSchema.signinSchema),
	usersController.signin
);
usersRouter.post(
	"/register",
	validateBody(usersSchema.signupSchema),
	usersController.signup
);
usersRouter.post("/signout", authentificate, usersController.signout);
usersRouter.get("/carrent", authentificate, usersController.carrent);

export default usersRouter;
