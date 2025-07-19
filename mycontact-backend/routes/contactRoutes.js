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

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API for managing contacts
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]

 *     responses:
 *       200:
 *         description: List of all user contacts
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *   delete:
 *     summary: Delete all contacts
 *     tags: [Contacts]

 *     responses:
 *       200:
 *         description: All contacts deleted
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact found
 *       404:
 *         description: Contact not found
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted
 */

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
