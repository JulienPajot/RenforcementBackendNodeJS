const express = require("express");
const router = express.Router();


router.post("/requests/:id/expertise-plan");
router.post("/requests/:id/expertise-complete");

router.post("/requests/:id/repair-plan");
router.post("/requests/:id/repair-start");
router.post("/requests/:id/repair-complete");
router.post("/requests/:id/invoice");
router.post("/requests/:id/payment");

router.post("/requests/:id/compensation-estimate");
router.post("/requests/:id/compensation-approve");
router.post("/requests/:id/rib");
router.post("/requests/:id/compensation-pay");

module.exports = router;