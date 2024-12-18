import express from "express";
import controllers from "../controllers/contactsControllers.js";
import { auth, isValidId } from "../middleware/index.js";
import { validateBody } from "../helpers/index.js";
import {
  createContactSchema,
  updateFavorite,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, controllers.getAllContacts);

contactsRouter.get("/:id", isValidId, controllers.getOneContact);

contactsRouter.delete("/:id", isValidId, controllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavorite),
  controllers.updateStatusContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  controllers.updateContact
);

export default contactsRouter;
