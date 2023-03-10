const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const midle = require("../helpers/middleware");
const roles = require("../utils/roles");

router.post("/nilaiGame", midle([roles.user]), cont.game.inputNilai);
router.get("/myGame", midle([roles.user]), cont.game.myGame);
router.delete("/hapusGame/:id", midle([roles.user]), cont.game.hapusGame);
router.patch("/editGame/:id", midle([roles.user]), cont.game.editGame);

module.exports = router;