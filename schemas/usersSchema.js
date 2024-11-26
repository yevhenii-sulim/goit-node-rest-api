import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleCreate } from "../hooks/hooks.js";

const signinSchema = Joi.object({
	email: Joi.string(),
	password: Joi.string(),
});
const signupSchema = Joi.object({
	email: Joi.string(),
	password: Joi.string(),
});

const usersSchema = new Schema({
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter",
	},
	token: {
		type: String,
		default: null,
	},
});

usersSchema.post("findOneAndUpdate", handleCreate);

usersSchema.post("save", handleCreate);

const Users = model("user", usersSchema);

export default {
	Users,
	signinSchema,
	signupSchema,
};
