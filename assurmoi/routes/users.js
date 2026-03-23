const express = require('express')
const router = express.Router()
const { validateUsername} = require('../middlewares/users')


router.post('/',validateUsername,(req, res)=> {
        const result = validationResult(req)
        if (!result.isEmpty()){
            res.status(400).json({
                message: "missing username"
            })
        }
        const user = req.body
        res.status(201).json({
            user: user 
        })
    })

router.get('/:id',(req,res, next)=>{
        res.status(200).json ({
            user: req.params.id
        })
    })

module.exports = router