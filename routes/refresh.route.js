const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshToken.Controller");

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
