const express = require("express");
const router = express.Router();

const { getAllRequests,getRequest,createRequest,updateRequest,deleteRequest} = require('../services/request')

router.post("/",createRequest);
router.get("/",getAllRequests);
router.get("/:id",getRequest);
router.patch("/:id/status",updateRequest);
router.delete("/:id",deleteRequest);

module.exports = router;