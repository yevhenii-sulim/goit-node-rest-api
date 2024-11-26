import express from "express";
import controllers from "../controllers/contactsControllers.js";
import schema from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import isValueId from "../middleWears/isValueId.js";
import authentificate from "../middleWears/authentificate.js";
const contactsRouter = express.Router();

contactsRouter.use(authentificate);

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", isValueId, controllers.getOneContact);

contactsRouter.delete("/:id", isValueId, controllers.deleteContact);

contactsRouter.post(
	"/",
	validateBody(schema.createContactSchema),
	controllers.createContact
);

contactsRouter.patch(
	"/:id/favorite",
	isValueId,
	validateBody(schema.updateFavorite),
	controllers.updateStatusContact
);

contactsRouter.put(
	"/:id",
	isValueId,
	validateBody(schema.updateContactSchema),
	controllers.updateContact
);

export default contactsRouter;
