const express = require("express");
const router = express.Router();
const { getAllSinisters,getSinisterById,createSinister,updateSinister,deleteSinister,validateSinister,uploadSinisterDocument} = require('../services/sinister')
const { validationAuthentification} = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {authorizeRoles,} = require("../middlewares/role");

router.post("/",validationAuthentification,authorizeRoles("ADMIN", "AGENT", "CLIENT"),createSinister);
router.post('/:id/documents', upload.single('file'), uploadSinisterDocument);

router.get("/",validationAuthentification,authorizeRoles("ADMIN", "AGENT", "CLIENT"),getAllSinisters);
router.get("/:id",validationAuthentification,authorizeRoles("ADMIN", "AGENT", "CLIENT"),getSinisterById);

router.patch("/:id",validationAuthentification,authorizeRoles("ADMIN", "AGENT", "CLIENT"),updateSinister);

router.patch("/:id/validate",validationAuthentification,authorizeRoles("ADMIN", "AGENT", "CLIENT"),validateSinister);

router.delete("/:id",validationAuthentification,authorizeRoles("ADMIN"),deleteSinister);

module.exports = router;