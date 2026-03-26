const express = require('express');
const router = express.Router();
const { advanceExpertise, advanceScenario1, advanceScenario2 } = require('../services/workflows');
 const { validationAuthentification} = require('../middlewares/auth')
 

router.post('/expertise/:id',validationAuthentification, advanceExpertise);
router.post('/scenario1/:id',validationAuthentification, advanceScenario1);
router.post('/scenario2/:id',validationAuthentification, advanceScenario2);
 
module.exports = router;