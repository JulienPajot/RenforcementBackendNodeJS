const express = require('express')
const router = express.Router()
const { validateUsername} = require('../middlewares/users')
const { validationAuthentification} = require('../middlewares/auth')

const { getAllUsers,getUser,createUser,updateUser,deleteUser} = require('../services/users')

router.post('/',validationAuthentification,validateUsername,createUser)

router.get('/:id',getUser)

router.get('/',getAllUsers)

router.delete('/:id',deleteUser)

router.put('/:id',updateUser)

module.exports = router