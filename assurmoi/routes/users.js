const express = require('express')
const router = express.Router()
const { validateUsername} = require('../middlewares/users')
const { validationAuthentification} = require('../middlewares/auth')

const { getAllUsers,getUser,createUser,updateUser,deleteUser,desactivateUser} = require('../services/users')

router.post('/',validationAuthentification,validateUsername,createUser)
router.get('/:id',validationAuthentification,getUser)
router.get('/',validationAuthentification,getAllUsers)
router.delete('/:id',validationAuthentification,deleteUser)
router.patch('/:id',validationAuthentification,updateUser)
router.delete('/:id/desactivate',validationAuthentification,desactivateUser)

module.exports = router