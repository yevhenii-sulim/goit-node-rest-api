import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValueId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, "not found"));
  }
  next();
};
export default isValueId;
