const { check, validationResult } = require("express-validator");
const contactModel = require("../../Models/userModel/userContact");

const contactValidationRules = () => {
  return [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address"),
    check("phone")
      .not()
      .isEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must contain only numbers"),
    check("category").notEmpty().withMessage("Category is required"),
    check("message")
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Enter atleast minimum 10 characters"),
    check("location").optional(),
  ];
};

// Add contact
const UserContact = async (req, res) => {
  const { name, email, phone, category, message, location } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const contact = new contactModel({
      name,
      email,
      phone,
      category,
      message,
      location,
    });
    await contact.save();
    res
      .status(201)
      .json({ message: "Contact successfully sent", contact: contact });
  } catch (e) {
    res.status(400).send(e);
  }
};

//get all contact
const GetUserContact = async (req, res) => {
  try {
    const contact = await contactModel.find().sort({ createdAt: -1 });
    res.status(200).json(contact);
  } catch (e) {
    res.status(400).send(e);
  }
};

//update contact
const UpdateContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await contactModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "update successfully", contact });
  } catch (e) {
    res.status(400).send(e);
  }
};

//delete contact

const DeleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    await contactModel.findByIdAndDelete(id);
    res.status(200).json({ message: "contact deleted successfully" });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  UserContact,
  GetUserContact,
  UpdateContact,
  DeleteContact,
  contactValidationRules,
};
