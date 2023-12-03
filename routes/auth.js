const express = require("express");
const AuthController = require("../controllers/auth");
const userController = require("../controllers/user");
const {upload} = require("../middlewars");
const router = express.Router();
const jsonParser = express.json();
const  {auth}  = require("../middlewars");
router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", auth, AuthController.logout );
router.post("/current", auth, AuthController.current);
router.get("/avatar",  userController.getAvatar);
router.patch("/avatar", upload.single("avatar"), userController.uploadAvatar);

module.exports = router;
