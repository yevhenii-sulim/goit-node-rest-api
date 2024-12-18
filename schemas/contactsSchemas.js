import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleCreate } from "../hooks/index.js";

const validateMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

const contactSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: validateMail,
  },
  name: {
    type: String,
    required: true,
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
});

contactSchema.post("save", handleCreate);
contactSchema.post("findOneAndUpdate", handleCreate);

export const Contacts = model("contact", contactSchema);

export const createContactSchema = Joi.object({
  email: Joi.string()
    .pattern(validateMail)
    .required("User email number required"),
  phone: Joi.string().required("User phone number required"),
  favorite: Joi.boolean(),
});

export const updateFavorite = Joi.object({
  favorite: Joi.boolean().required("User favorite required"),
});

export const updateContactSchema = Joi.object({
  email: Joi.string().pattern(validateMail),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("email", "phone", "favorite");
