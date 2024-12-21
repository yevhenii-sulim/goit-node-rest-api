import path from "node:path";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import { Jimp } from "jimp";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { ctrlWrapper, HttpError, sendMail } from "../helpers/index.js";
import { Users } from "../schemas/userSchema.js";

const { BASE_URL_LOCAL, BASE_URL } = process.env;

const URL = BASE_URL_LOCAL || BASE_URL;

const signup = async (req, res) => {
  const { email, password: nativePassword } = req.body;

  let avatarURL = gravatar.url(email);

  if (req.file) {
    const destination = path.join(req.file.destination, req.file.filename);
    const extension = req.file.mimetype.split("/")[1];
    const pathAvatar = path.resolve("public", "avatars");
    const image = await Jimp.read(destination);
    image.resize({ w: 250, h: 250 });
    const fileName = `${email.split("@")[0]}.${extension}`;
    await image.write(path.join(pathAvatar, fileName));
    await fs.unlink(destination);
    avatarURL = path.join("avatars", fileName);
  }

  const user = await Users.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const password = await bcrypt.hash(nativePassword, 10);
  const verificationToken = nanoid();
  const newUser = await Users.create({
    ...req.body,
    password,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Approving email",
    html: `<a href="${URL}/users/verify/${verificationToken}">Approve your email</a>`,
  };
  await sendMail(verifyEmail);
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

  await usersSchema.Users.findByIdAndUpdate(id, {
    avatarURL,
  });

  res.status(200).json({
    avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;
  const user = await Users.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(404, "User not found");
  }

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await Users.findByIdAndUpdate(
    { _id: user._id },
    {
      ...req.body,
      token,
    }
  );
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await Users.findOneAndUpdate({ _id }, { ...req.body, token: "" });
  res.status(204).end();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw HttpError(400, "Verification has already been passed");
  }
  const user = await Users.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "User not found");
  }
  await Users.findOneAndUpdate(
    { _id: user._id },
    { verificationToken: "", verify: true }
  );
  res.status(200).json({ message: "Verification successful" });
};

const reVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await Users.findOne({ email });
  if (!user) {
    throw HttpError(401, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Approving email",
    html: `<a href="${URL}/users/verify/${user.verificationToken}">Approve your email</a>`,
  };
  await sendMail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  avatarChange: ctrlWrapper(avatarChange),
  verify: ctrlWrapper(verify),
  reVerify: ctrlWrapper(reVerify),
};
