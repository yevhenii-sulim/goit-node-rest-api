import { ctrlWrappers } from "../helpers/index.js";
import contactSchema from "../schemas/contactsSchemas.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { _id: owner = "" } = req.user;
  const skip = (page - 1) * limit;
  const result = await contactSchema.Contacts.find({ owner }, null, {
    skip,
    limit,
  });
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactSchema.Contacts.findOne({ _id: id, owner });
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactSchema.Contacts.findOneAndDelete(
    { _id: id, owner },
    { remove: true }
  );
  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await contactSchema.Contacts.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await contactSchema.Contacts.findOneAndUpdate(
    { _id: id, owner },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(201).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const data = req.body;
  const updatedContact = await contactsModel.Contacts.findOneAndUpdate(
    { _id: id, owner },
    data,
    { new: true, runValidators: true }
  );
  if (!updatedContact) {
    throw HttpError(404, "not found");
  }
  res.status(200).json(updatedContact);
};

export default {
  getAllContacts: ctrlWrappers(getAllContacts),
  getOneContact: ctrlWrappers(getOneContact),
  deleteContact: ctrlWrappers(deleteContact),
  createContact: ctrlWrappers(createContact),
  updateContact: ctrlWrappers(updateContact),
  updateStatusContact: ctrlWrappers(updateStatusContact),
};
