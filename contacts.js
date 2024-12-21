import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

export default class Contacts {
  async listContacts() {
    const contactList = await fs.readFile(`${contactsPath}`);
    return JSON.parse(contactList.toString());
  }

  async getContactById(contactId) {
    const contact = await this.listContacts();
    const foundContactById = contact.find((item) => item.id === contactId);

    if (!foundContactById) {
      return null;
    }

    return foundContactById;
  }

  async removeContact(contactId) {
    const contactRemoving = await this.getContactById(contactId);

    const contactList = await this.listContacts();
    const filteredContacts = contactList.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(
      `${contactsPath}`,
      JSON.stringify(filteredContacts, null, 2)
    );
    return contactRemoving;
  }

  async addContact(name, email, phone) {
    const contacts = await this.listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(`${contactsPath}`, JSON.stringify(contacts, null, 2));
    return newContact;
  }
}
