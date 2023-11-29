const express = require("express");
const AuthController = require("../controllers/auth");
const router = express.Router();
const jsonParser = express.json();
const  {auth}  = require("../middlewars");
router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", auth, AuthController.logout );
router.post("/current", auth, AuthController.current)

module.exports = router;
