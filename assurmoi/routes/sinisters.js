const express = require("express");
const router = express.Router();

router.post("/sinisters");

router.get("/sinisters");
router.get("/sinisters/:id");

router.patch("/sinisters/:id");

router.patch("/sinisters/:id/validate");

router.delete("/sinisters/:id");

module.exports = router;