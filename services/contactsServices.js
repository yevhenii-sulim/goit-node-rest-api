import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const pathContactsFile = path.join(process.cwd(), "db", "contacts.json");

export default class Contacts {
  async listContacts() {
    const contacts = await fs.readFile(`${pathContactsFile}`);
    return JSON.parse(contacts.toString());
  }
  async getContactById(contactId) {
    const contactList = await this.listContacts();
    const foundContact = contactList.find((item) => item.id === contactId);
    if (!foundContact) return null;
    return foundContact;
  }
  async removeContact(contactId) {
    const foundContact = await this.getContactById(contactId);
    const contactList = await this.listContacts();
    const filteredContactList = contactList.filter(
      (item) => item.id !== contactId
    );
    await fs.writeFile(
      `${pathContactsFile}`,
      JSON.stringify(filteredContactList, null, 2)
    );
    return foundContact;
  }
  async addContact(name, email, phone) {
    const contacts = await this.listContacts();
    const foundSimilarName = contacts.find((item) => item.name === name);
    if (foundSimilarName) return "A similar name already exists.";
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(
      `${pathContactsFile}`,
      JSON.stringify(contacts, null, 2)
    );
    return newContact;
  }
  async updateContact(contactId, contactData) {
    const contactList = await this.listContacts();
    const indexContact = contactList.findIndex((item) => item.id === contactId);
    const startContactList = contactList.slice(0, indexContact);
    const endContactList = contactList.slice(
      indexContact + 1,
      contactList.length
    );
    await fs.writeFile(
      `${pathContactsFile}`,
      JSON.stringify(
        [...startContactList, contactData, ...endContactList],
        null,
        2
      )
    );
  }
}
