const express = require("express");
const router = express.Router();
const path = require("path");
const usersController = require("../../controllers/user.controller");
const ROLES_LIST = require("../../configs/roles_list");
const verifyRoles = require("../../middeware/verifyRoles");
router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

module.exports = router;
