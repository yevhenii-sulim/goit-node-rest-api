import { ctrlWrapper } from "../helpers/index.js";
import { Contacts } from "../schemas/contactsSchemas.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { _id: owner } = req.user;
  const skip = (page - 1) * limit;
  const result = await Contacts.find({ owner }, null, { skip, limit });
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contacts.findOne({ _id: id, owner });
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contacts.findOneAndDelete({ _id: id, owner });
  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contacts.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const data = req.body;
  const updatedContact = await Contacts.findOneAndUpdate(
    { _id: id, owner },
    data,
    { new: true, runValidators: true }
  );
  res.status(200).json(updatedContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contacts.findByIdAndUpdate(
    { _id: id, owner },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
