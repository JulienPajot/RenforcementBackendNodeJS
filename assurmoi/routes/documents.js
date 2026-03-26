const express = require("express");
const router = express.Router();
const { validationAuthentification} = require('../middlewares/auth')

const { getDocumentById,createDocument,updateDocument,deleteDocument} = require('../services/documents')

router.post("/",validationAuthentification,createDocument);
router.get("/:id",validationAuthentification,getDocumentById);
router.patch("/:id/validate",validationAuthentification,updateDocument);
router.delete("/:id",validationAuthentification,deleteDocument);

module.exports = router;