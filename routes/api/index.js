const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");

router.use("/users", authRoutes);
module.exports = router;
