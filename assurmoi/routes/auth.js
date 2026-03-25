const express = require("express");
const router = express.Router();

router.post("/auth/login");
router.post("/auth/refresh");

module.exports = router;