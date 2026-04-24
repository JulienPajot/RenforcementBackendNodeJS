const express = require("express");
const router = express.Router();

const { login,logout,forgotPassword,resetPassword} = require('../services/auth')
const { validationAuthentification} = require('../middlewares/auth')

router.post('/login',login)
router.post('/logout', validationAuthentification, logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports =router