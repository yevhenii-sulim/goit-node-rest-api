import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import SchemeContacts from "../schemas/SchemaContacts.js";

const getAllContacts = async (req, res) => {
  const contacts = await SchemeContacts.Constants.find();
  res.status(200).json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await SchemeContacts.Constants.findById(id);
  if (!contact) {
    throw HttpError(404, "not found");
  }
  res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const removedContact = await SchemeContacts.Constants.findByIdAndDelete(id);
  if (!removedContact) {
    throw HttpError(404, "not found");
  }
  res.json(removedContact);
};

const createContact = async (req, res, next) => {
  const data = req.body;
  const addedData = await SchemeContacts.Constants(data);
  res.status(201).json(addedData);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const updatedContact = await SchemeContacts.Constants.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!updatedContact) {
    throw HttpError(404, "not found");
  }
  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const updatedContact = await SchemeContacts.Constants.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!updatedContact) {
    throw HttpError(404, "not found");
  }
  res.status(200).json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
