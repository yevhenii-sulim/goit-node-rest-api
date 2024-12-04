import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleCreate } from "../hooks/hooks.js";

const validateMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
const validatePone =
	/^\+380(\d{3}|\(\d{3}\))[-\s]?\d{3}[-\s]?\d{4}$|^\(\d{3}\)\s?\d{3}[-\s]?\d{4}$/;
const createContactSchema = Joi.object({
	name: Joi.string().required("User name number required"),
	email: Joi.string()
		.pattern(validateMail)
		.required("User email number required"),
	phone: Joi.string()
		.pattern(validatePone)
		.required("User phone number required"),
	favorite: Joi.boolean(),
});

const updateFavorite = Joi.object({
	favorite: Joi.boolean().required("User favorite required"),
});

const updateContactSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().pattern(validateMail),
	phone: Joi.string().pattern(validatePone),
	favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const contactSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
		require: true,
	},
	phone: {
		type: String,
		require: true,
		pattern: validatePone,
	},
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		pattern: validateMail,
		require: true,
	},
	favorite: {
		type: Boolean,
		default: false,
	},
});

const Contacts = model("contact", contactSchema);

contactSchema.post("save", handleCreate);
contactSchema.post("findOneAndUpdate", handleCreate);

export default {
	Contacts,
	createContactSchema,
	updateFavorite,
	updateContactSchema,
};
