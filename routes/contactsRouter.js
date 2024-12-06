import express from "express";
import controllers from "../controllers/contactsControllers.js";
import { authenticated, isValueId } from "../middlewares/index.js";
import { validateBody } from "../helpers/index.js";
import schema from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticated);

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
