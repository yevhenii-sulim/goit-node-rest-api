import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrappers.js";
import contactsModel from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const { _id: owner } = req.user;
	const skip = (page - 1) * limit;
	const result = await contactsModel.Contacts.find({ owner }, null, {
		skip,
		limit,
	}).populate("owner", "email");
	res.status(200).json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const contact = await contactsModel.Contacts.findById(id);
	if (!contact) {
		throw HttpError(404, "not found");
	}
	res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const removedContact = await contactsModel.Contacts.findByIdAndDelete(id);
	if (!removedContact) {
		throw HttpError(404, "not found");
	}
	res.json(removedContact);
};

const createContact = async (req, res) => {
	const { _id: owner } = req.user;
	const addedData = await contactsModel.Contacts.create({ ...req.body, owner });
	res.status(201).json(addedData);
};

const updateContact = async (req, res) => {
	const { id } = req.params;
	const data = req.body;
	const updatedContact = await contactsModel.Contacts.findByIdAndUpdate(
		id,
		data,
		{ new: true, runValidators: true }
	);
	if (!updatedContact) {
		throw HttpError(404, "not found");
	}
	res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const data = req.body;
	const updatedContact = await contactsModel.Contacts.findByIdAndUpdate(
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
