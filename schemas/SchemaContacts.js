import { Schema, model } from "mongoose";

import Joi from "joi";
const validateName = /^[A-Z][a-z]{1,} [A-Z][a-z]{1,}$/;
const validateMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
const validatePone =
  /^\+380(\d{3}|\(\d{3}\))[-\s]?\d{3}[-\s]?\d{4}$|^\(\d{3}\)\s?\d{3}[-\s]?\d{4}$/;
const createContactSchema = Joi.object({
  name: Joi.string()
    .pattern(validateName)
    .required("User name number required"),
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
  name: Joi.string().pattern(validateName),
  email: Joi.string().pattern(validateMail),
  phone: Joi.string().pattern(validatePone),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const contacts = new Schema({
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
});

contacts.post("save", (err, _, next) => {
  err.status === 400;
  next();
});
contacts.post("findOneAndUpdate", (err, _, next) => {
  err.status === 400;
  next();
});

const Constants = model("contact", contacts);

export default {
  Constants,
  createContactSchema,
  updateContactSchema,
  updateFavorite,
};
