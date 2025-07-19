const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactByID,
  creatContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
} = require("../controllers/myContactControllers");

const validateToken = require("../middleware/validateTokenHandler");

// Apply middleware correctly
router.use(validateToken);

//same path so using get and post in one line
router.route("/").get(getContacts).post(creatContact).delete(deleteAllContacts);

//same but in one line code above
//always remember _id is the primary key in mongoDB, not the user_id this is the foreign key
// user_id is used to link the contact with the user

// we need to search the contact by id not by user_id, user_id is used to check whether the user is authorized to access that contact or not
// so we need to use the user_id in the controller to check if the user is authorized
router
  .route("/:id")
  .get(getContactByID)
  .put(updateContact)
  .delete(deleteContact);

//we have same route path for getbyId, put and delete, so we can maintain all in same line
// router.route("/:id").get(getContactByID);
// router.route("/:id");
// router.route("/:id");

module.exports = router;
