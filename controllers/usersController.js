import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrappers.js";
import usersSchema from "../schemas/usersSchema.js";

const { JWT_SICRET } = process.env;

const signup = async (req, res) => {
	const { password, email } = req.body;
	const hash = await bcrypt.hash(password, 10);
	const user = await usersSchema.Users.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}
	const newUser = await usersSchema.Users.create({
		...req.body,
		password: hash,
	});
	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
};

const signin = async (req, res) => {
	const { password, email } = req.body;
	const user = await usersSchema.Users.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}
	const thisPassword = bcrypt.compare(password, user.password);
	if (!thisPassword) {
		throw HttpError(401, "Email or password is wrong");
	}

	const payload = {
		id: user._id,
	};
	const token = jwt.sign(payload, JWT_SICRET, { expiresIn: "23h" });
	await usersSchema.Users.findByIdAndUpdate(user._id, { token });
	res.status(200).json({
		token,
		email,
		subscription: user.subscription,
	});
};
const signout = async (req, res) => {
	const { _id } = req.user;
	await usersSchema.Users.findByIdAndUpdate(_id, { token: "" });
	res.status(204);
};

const carrent = async (req, res) => {
	const { email, subscription } = req.user;
	res.status(200).json({ email, subscription });
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	signout: ctrlWrapper(signout),
	carrent: ctrlWrapper(carrent),
};
