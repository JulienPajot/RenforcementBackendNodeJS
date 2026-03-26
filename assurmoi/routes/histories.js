const express = require("express");
const router = express.Router();

const { getAllHistories,getHistoryById,createHistory,updateHistory,deleteHistory} = require('../services/history')
const { validationAuthentification} = require('../middlewares/auth')

router.post("/",validationAuthentification,createHistory);
router.get("/",validationAuthentification,getAllHistories);
router.get("/:id",validationAuthentification,getHistoryById);
router.patch("/:id",validationAuthentification,updateHistory);
router.delete("/:id",validationAuthentification,deleteHistory);

module.exports = router;