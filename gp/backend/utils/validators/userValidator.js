const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid information ID Format"),
  validatorMiddleware,
];
