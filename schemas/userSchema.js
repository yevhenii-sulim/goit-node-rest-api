import { Schema, model } from "mongoose";
import { handleCreate } from "../hooks/index.js";
import Joi from "joi";

const validateMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

const usersSchema = new Schema({
  token: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: validateMail,
    trim: true,
    lowercase: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  avatarURL: {
    type: String,
    trim: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

usersSchema.post("save", handleCreate);
usersSchema.post("findOneAndUpdate", handleCreate);

export const Users = model("user", usersSchema);

export const signinSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const verifySchema = Joi.object({
  email: Joi.string().required().pattern(validateMail),
});

export const signupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
