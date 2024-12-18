import jwt from "jsonwebtoken";
import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { Users } from "../schemas/userSchema.js";

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw HttpError(401, "Not authorized");
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ _id: id });
    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
};
export default ctrlWrapper(auth);
