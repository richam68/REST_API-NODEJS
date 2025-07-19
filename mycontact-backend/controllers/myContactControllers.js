const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//Whenever creating any api need to give label

//@desc Get all contacts
//@route GET/api/contacts
//@access private

//Note 1: In backend we deal with database, here i m using mongoDB,
//  mongoDb accepts promise, so for that reason i need to
//  create promise that's why i m using async in my controlller

//Note2: For better handling cases we have package express async handler,
// For handling we can use try catch block as well
const getContacts = asyncHandler(async (req, res) => {
  //let use the user id
  //all the contact of user who will be longged in
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Get contact by id
//@route GET/api/contact/:id
//@access private
const getContactByID = asyncHandler(async (req, res) => {
  //we need to find the contact by that particular user id
  // we cannot see the data of other user
  //so we need to use user id: findById(req.params.id)

  const findContact = await Contact.findById(req.params.id);
  if (!findContact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(findContact);
});

//@desc Create New Contact
//@route POST/api/contacts
//@access private
const creatContact = asyncHandler(async (req, res) => {
  //for creating body data
  const { name, email, phoneNumber } = req.body;

  //for non-filled any mandatory fileds this block will run
  if (!name || !email || !phoneNumber) {
    res.status(400);
    throw new Error("All fields are madatory");
  }

  //on success this res block will run
  const contact = await Contact.create({
    name,
    email,
    phoneNumber,
    user_id: req.user.id, // Attach the user ID from the request
  });
  res.status(201).json(contact);
});

//@desc Update Contact
//@route PUT/api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  //first we need to fetch the contact
  const updateById = await Contact.findById(req.params.id);
  if (!updateById) {
    res.status(404);
    throw new Error("Contact not found");
  }

  //we need to check whether the user is trying to update the contact of it's own or not
  if (updateById.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User not authorized to update this contact");
  }
  //if that contact find then update the contact
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } //new:true means it will return the updated object
  );
  res.status(200).json(updateContact);
});

//@desc Delete Contact
//@route DELETE/api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  //fetch the contact from the database
  const deleteById = await Contact.findById(req.params.id);
  if (!deleteById) {
    res.status(404);
    throw new Error("Contact not found");
  }
  //we need to check whether the user is trying to update the contact of it's own or not
  if (deleteById.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User not authorized to update this contact");
  }
  //await Contact.remove() // if we want to delete all the contacts in the database
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(deleteById);
});

//@desc Delete Contact
//@route DELETE/api/contacts/
//@access private
const deleteAllContacts = asyncHandler(async (req, res) => {
  //we need to check whether the user is trying to update the contact of it's own or not
  if (req.user.id) {
    await Contact.deleteMany({ user_id: req.user.id });
    res.status(200).json({ message: "All contacts deleted successfully" });
  } else {
    res.status(403);
    throw new Error("User not authorized to delete contacts");
  }
});

module.exports = {
  getContacts,
  getContactByID,
  creatContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
};
