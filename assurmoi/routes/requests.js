const express = require("express");
const router = express.Router();

const { getAllRequests,getRequest,createRequest,updateRequest,deleteRequest} = require('../services/request')

router.post("/requests",createRequest);
router.get("/requests",getAllRequests);
router.get("/requests/:id",getRequest);
router.patch("/requests/:id/status",updateRequest);
router.delete("/requests/:id",deleteRequest);

module.exports = router;