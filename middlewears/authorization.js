import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import ctrlWrappers from "../helpers/ctrlWrappers.js";
import usersSchema from "../schemas/usersSchema.js";
const { JWT_SICRET } = process.env;

const authentificate = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		throw HttpError(401, "Not authorized");
	}

	const [bearer, token] = authorization.split(" ");
	if (bearer !== "Bearer") {
		throw HttpError(401, "Not authorized");
	}

	try {
		const { id } = jwt.verify(token, JWT_SICRET);
		const user = await usersSchema.Users.findById(id);
		if (!user || !user.token || user.token !== token) {
			throw HttpError(401, "Not authorized");
		}
		req.user = user;
		next();
	} catch (error) {
		throw HttpError(401, "Not authorized");
	}
};
export default ctrlWrappers(authentificate);
