const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logout.Controller");

router.get("/", logoutController.handleLogout);

module.exports = router;
