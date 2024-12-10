import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { HttpError, ctrlWrappers, cloudinary } from "../helpers/index.js";
import usersSchema from "../schemas/usersSchema.js";
import { Jimp } from "jimp";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const avatarPathFolder = path.resolve("public", "avatars");
  const { userName, email, password } = req.body;
  let file = null;

  let extension = null;

  if (req.file) {
    file = req.file;

    const image = await Jimp.read(`${file.path}`);
    extension = file.mimetype.split("/").pop();
    const avatarFullPath = path.join(
      `${avatarPathFolder}`,
      `${userName}.${extension}`
    );

    image.resize({ w: 250, h: 250 });
    await image.write(`${avatarFullPath}`);
    const avatarByCloud = await cloudinary.uploader.upload(`${avatarFullPath}`);
    const avatarURLCloud = cloudinary.url(avatarByCloud.asset_folder, {
      transformation: [
        { fetch_format: "auto", quality: "auto" },
        { crop: "fill", gravity: "auto", width: 250, height: 250 },
      ],
    });
  }
  const unsecureUrl = gravatar.url(`${email}`, {}, false);

  const avatarURL = file
    ? path.join("avatars", `${userName}.${extension}`)
    : unsecureUrl;

  const hash = await bcrypt.hash(password, 10);

  const existedUser = await usersSchema.Users.findOne({ email });
  if (existedUser) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await usersSchema.Users.create({
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
  const { path: oldPath, mimetype } = req.file;
  const avatarPathFolder = path.resolve("public", "avatars");

  const extension = mimetype.split("/").pop();
  const avatarFullPath = path.join(
    `${avatarPathFolder}`,
    `${userName}.${extension}`
  );
  const image = await Jimp.read(`${oldPath}`);
  image.resize({ w: 250, h: 250 });
  await image.write(`${avatarFullPath}`);
  await fs.unlink(`${oldPath}`);

  const avatarURL = path.join("avatars", `${userName}.${extension}`);

  const avatarByCloud = await cloudinary.uploader
    .upload(avatarFullPath, {
      folder: "avatars",
    })
    .catch((error) => {
      console.log(error);
    });

  const avatarURLCloud = cloudinary.url(avatarByCloud.asset_folder, {
    transformation: [
      { fetch_format: "auto", quality: "auto" },
      { crop: "fill", gravity: "auto", width: 250, height: 250 },
    ],
  });

  await usersSchema.Users.findByIdAndUpdate(id, {
    avatarURL,
  });

  res.status(200).json({
    avatarURL,
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
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
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
