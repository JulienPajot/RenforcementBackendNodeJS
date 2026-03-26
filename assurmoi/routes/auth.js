const express = require("express");
const router = express.Router();

const { login,logout} = require('../services/auth')
const { validationAuthentification} = require('../middlewares/auth')

router.post('/login',login)
router.post('/logout', validationAuthentification, logout);

module.exports =router