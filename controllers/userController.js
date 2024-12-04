import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { HttpError, ctrlWrappers } from "../helpers/index.js";
import usersSchema from "../schemas/usersSchema.js";
import { Jimp } from "jimp";

const { JWT_SICRET } = process.env;
const avatarPathFolder = path.resolve("public", "avatars");

const signup = async (req, res) => {
	const { userName, email, password } = req.body;
	const { path: oldPath, mimetype, filename } = req.file;

	const extention = mimetype.split("/").pop();

	const avatarPath = path.join(
		`${avatarPathFolder}`,
		`${userName}.${extention}`
	);
	const avatarURL = path.join("avatars", `${userName}.${extention}`);

	const oldImage = await Jimp.read(`${oldPath}`);
	oldImage.resize(250, 250);
	await oldImage.write(`${avatarPath}`);

	await fs.rename(oldPath, avatarPath);

	const hash = await bcrypt.hash(password, 10);
	const existedUser = await usersSchema.Users.findOne({ email });
	if (existedUser) {
		throw HttpError(409, "Email in use");
	}
	const newUser = usersSchema.Users.create({
		...req.body,
		password: hash,
		avatarURL,
	});
	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};
const avatarChange = async (req, res) => {
	const { _id: id, userName } = req.user;
	const { path: oldPath, mimetype, filename } = req.file;
	const extention = mimetype.split("/").pop();

	const avatarPath = path.join(
		`${avatarPathFolder}`,
		`${userName}.${extention}`
	);
	const avatarURL = path.join("avatars", `${userName}.${extention}`);

	const oldImage = await Jimp.read(`${oldPath}`);
	oldImage.resize(250, 250);
	await oldImage.write(`${avatarPath}`);

	await fs.rename(oldPath, avatarPath);
	await usersSchema.Users.findByIdAndUpdate(id, {
		avatarURL,
	});
	res.status(200).json({
		ResponseBody: {
			avatarURL: avatarURL,
		},
	});
};
const signin = async (req, res) => {
	const { email, password } = req.body;
	const existedUser = await usersSchema.Users.findOne({ email });
	if (!existedUser) {
		throw HttpError(401, "Email or password is wrong");
	}
	const compare = await bcrypt.compare(password, existedUser.password);
	if (!compare) {
		throw HttpError(401, "Email or password is wrong");
	}
	const payload = {
		id: existedUser._id,
	};
	const token = jwt.sign(payload, JWT_SICRET, { expiresIn: "23h" });
	await usersSchema.Users.findByIdAndUpdate(existedUser._id, { token });
	res.status(200).json({
		token,
		user: {
			email,
			subscription: existedUser.subscription,
		},
	});
};
const logout = async (req, res) => {
	const { _id } = req.user;
	await usersSchema.Users.findByIdAndUpdate(_id, { token: "" });
	res.status(204).end();
};

const current = async (req, res) => {
	const { email, subscription } = req.user;
	res.status(200).json({ email, subscription });
};

export default {
	signup: ctrlWrappers(signup),
	signin: ctrlWrappers(signin),
	logout: ctrlWrappers(logout),
	current: ctrlWrappers(current),
	avatarChange: ctrlWrappers(avatarChange),
};
