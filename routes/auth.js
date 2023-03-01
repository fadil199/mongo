const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const midle = require("../helpers/middleware");
const roles = require("../utils/roles");

router.post("/register", cont.auth.register);
router.post("/login", cont.auth.login);
router.get("/me", midle([roles.user]), cont.auth.akunSaya);
router.get("/verif", cont.auth.verifyEmail);
router.get("/profile", midle([roles.user]), cont.auth.myprofile);
router.patch("/updateProfile", midle([roles.user]), cont.auth.updateProfile);

module.exports = router;