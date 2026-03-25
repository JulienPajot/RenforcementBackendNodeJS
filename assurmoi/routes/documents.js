const express = require("express");
const router = express.Router();

router.post("/documents");
router.get("/documents/:id");
router.patch("/documents/:id/validate");
router.delete("/documents/:id");

module.exports = router;