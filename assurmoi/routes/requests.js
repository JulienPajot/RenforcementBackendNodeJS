const express = require("express");
const router = express.Router();


router.post("/requests");
router.get("/requests");
router.get("/requests/:id");
router.patch("/requests/:id/status");
router.delete("/requests/:id");

module.exports = router;