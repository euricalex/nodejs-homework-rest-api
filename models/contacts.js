require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  const removedContact = await Contact.findOneAndDelete({ _id: contactId });
  return removedContact ? { message: 'Contact removed successfully' } : null;
};


const addContact = async (body) => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
};
const updateStatusContact = async(contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
};
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

// Обробка помилок підключення
mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
