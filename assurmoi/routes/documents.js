const express = require("express");
const router = express.Router();

const { getDocumentById,createDocument,updateDocument,deleteDocument} = require('../services/documents')

router.post("/",createDocument);
router.get("/:id",getDocumentById);
router.patch("/:id/validate",updateDocument);
router.delete("/:id",deleteDocument);

module.exports = router;