const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getOneInfoValidator = [
  check("id").isMongoId().withMessage("Invalid information ID Format"),
  validatorMiddleware,
];

exports.createInfoValidator = [
  check("name")
    .notEmpty()
    .withMessage("Information name Required")
    .isLength({ min: 3 })
    .withMessage("Too Short information Name")
    .isLength({ max: 32 })
    .withMessage("too long information name"),
check("information")
    .notEmpty()
    .withMessage("Information Required")
    .isLength({ min: 3 })
    .withMessage("Too Short information "),
  validatorMiddleware,
];

exports.updateInfoValidator = [
  check("id").isMongoId().withMessage("Invalid information ID Format"),
  check("name")
  .notEmpty()
  .withMessage("Information name Required")
  .isLength({ min: 3 })
  .withMessage("Too Short information Name")
  .isLength({ max: 32 })
  .withMessage("too long information name"),
check("information")
  .notEmpty()
  .withMessage("Information Required")
  .isLength({ min: 3 })
  .withMessage("Too Short information "),
  validatorMiddleware,
];

exports.deleteInfoValidator = [
  check("id").isMongoId().withMessage("Invalid information ID Format"),
  validatorMiddleware,
];
