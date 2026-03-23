const express = require('express')
const router = express.Router()
const { validateUsername} = require('../middlewares/users')
const { getAllUsers,getUser,createUser,updateUser,deleteUser} = require('../services/users')

router.post('/',validateUsername,(req, res)=> {
        createUser
    })

router.get('/:id',(req,res, next)=>{
        getUser
    })

router.get('/',(req,res, next)=>{
        getAllUsers
    })

router.delete('/:id',(req,res, next)=>{
        deleteUser
    })

router.put('/:id',(req,res, next)=>{
        updateUser
    })

module.exports = router