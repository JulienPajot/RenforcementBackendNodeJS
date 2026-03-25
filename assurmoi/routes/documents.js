const express = require("express");
const router = express.Router();

const { getDocumentById,createDocument,updateDocument,deleteDocument} = require('../services/documents')

router.post("/documents",createDocument);
router.get("/documents/:id",getDocumentById);
router.patch("/documents/:id/validate",updateDocument);
router.delete("/documents/:id",deleteDocument);

module.exports = router;