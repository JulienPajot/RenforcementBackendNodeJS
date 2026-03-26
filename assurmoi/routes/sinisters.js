const express = require("express");
const router = express.Router();
const { getAllSinisters,getSinisterById,createSinister,updateSinister,deleteSinister,validateSinister} = require('../services/sinister')
const { validationAuthentification} = require('../middlewares/auth')

router.post("/",validationAuthentification,createSinister);

router.get("/",validationAuthentification,getAllSinisters);
router.get("/:id",validationAuthentification,getSinisterById);

router.patch("/:id",validationAuthentification,updateSinister);

router.patch("/:id/validate",validationAuthentification,validateSinister);

router.delete("/:id",validationAuthentification,deleteSinister);

module.exports = router;