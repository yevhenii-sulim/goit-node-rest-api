import { Schema, model } from "mongoose";
import Joi from "joi";

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

const contactShema = new Schema({
	name: {
		type: String,
		required: [true, "Set name for contact"],
	},
	email: {
		type: String,
	},
	phone: {
		type: String,
	},
	favorite: {
		type: Boolean,
		default: false,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
});

contactShema.post("save", (err, _, next) => {
	err.status === 400;
	next();
});
contactShema.post("findOneAndUpdate", (err, _, next) => {
	err.status === 400;
	next();
});

const Contacts = model("contact", contactShema);

export default {
	Contacts,
	createContactSchema,
	updateContactSchema,
	updateFavorite,
};
