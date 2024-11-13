import express from "express";
import controllers from "../controllers/contactControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post("/", controllers.createContact);

contactsRouter.put("/:id", controllers.updateContact);

export default contactsRouter;
