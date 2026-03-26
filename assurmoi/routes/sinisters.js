const express = require("express");
const router = express.Router();
const { getAllSinisters,getSinisterById,createSinister,updateSinister,deleteSinister,validateSinister} = require('../services/sinister')

router.post("/",createSinister);

router.get("/",getAllSinisters);
router.get("/:id",getSinisterById);

router.patch("/:id",updateSinister);

router.patch("/:id/validate",validateSinister);

router.delete("/:id",deleteSinister);

module.exports = router;