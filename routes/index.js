const express = require("express");
const router = express.Router();
const auth = require("./auth");
const game = require("./game")

router.use("/auth", auth);
router.use("/game", game);

module.exports = router;
