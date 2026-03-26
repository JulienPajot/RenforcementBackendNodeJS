const express = require('express');
const router = express.Router();
const { advanceExpertise, advanceScenario1, advanceScenario2 } = require('../services/workflows');
 

router.post('/expertise/:id', advanceExpertise);
router.post('/scenario1/:id', advanceScenario1);
router.post('/scenario2/:id', advanceScenario2);
 
module.exports = router;