import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleCreate } from "../hooks/hooks.js";

const signinSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const signupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
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
  avatarURL: String,
});

const Users = model("user", usersSchema);

usersSchema.post("save", handleCreate);

usersSchema.post("findOneAndUpdate", handleCreate);

export default { Users, signinSchema, signupSchema };
