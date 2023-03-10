const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const midle = require("../helpers/middleware");
const roles = require("../utils/roles");
const storage = require('../utils/storage')
const multer = require('multer');
const upload = multer();


router.post("/register", cont.auth.register);
router.post("/login", cont.auth.login);
router.get("/me", midle([roles.user]), cont.auth.akunSaya);
router.get("/verif", cont.auth.verifyEmail);
router.get("/profile", midle([roles.user]), cont.auth.myprofile);
router.patch("/updateProfile", midle([roles.user]), cont.auth.updateProfile);
router.patch("/image", midle([roles.user]), upload.single('image'), cont.auth.changeImage);
router.post('/single/image', midle([roles.user]), storage.image.single('media'), (req, res) => {
    const imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;

    return res.json({
        url_file: imageUrl,
        nama_file: req.file.filename
    });
});


module.exports = router;