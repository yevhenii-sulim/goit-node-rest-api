import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import ContactsService from "../services/contactsServices.js";
const contactsService = new ContactsService();

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    if (!contacts) {
      throw HttpError(404);
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { body } = req;
    const { name, email, phone } = body;
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw HttpError(404);
    }
    const { error } = updateContactSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { name, email, phone } = body;

    if (name) {
      contact.name = name;
    }
    if (email) {
      contact.email = email;
    }
    if (phone) {
      contact.phone = phone;
    }
    await contactsService.updateContact(id, contact);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
