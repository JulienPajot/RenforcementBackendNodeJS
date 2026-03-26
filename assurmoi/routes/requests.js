const express = require("express");
const router = express.Router();

const { getAllRequests,getRequest,createRequest,updateRequest,deleteRequest} = require('../services/request')
const { validationAuthentification} = require('../middlewares/auth')

router.post("/",validationAuthentification,createRequest);
router.get("/",validationAuthentification,getAllRequests);
router.get("/:id",validationAuthentification,getRequest);
router.patch("/:id/status",validationAuthentification,updateRequest);
router.delete("/:id",validationAuthentification,deleteRequest);

module.exports = router;