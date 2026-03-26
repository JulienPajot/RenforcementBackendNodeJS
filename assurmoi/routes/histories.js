const express = require("express");
const router = express.Router();

const { getAllHistories,getHistoryById,createHistory,updateHistory,deleteHistory} = require('../services/history')

router.post("/",createHistory);
router.get("/",getAllHistories);
router.get("/:id",getHistoryById);
router.patch("/:id",updateHistory);
router.delete("/:id",deleteHistory);

module.exports = router;