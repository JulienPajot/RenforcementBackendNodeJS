    const express = require('express')
    const app = express()
    require('dotenv').config()

    const PORT = process.env.PORT || 3000

    app.use(express.json())
    
    app.post('/user/',(req, res)=> {
        const user = req.body
        res.status(201).json({
            user: user 
        })
    })

    app.get('/user/:id',(req,res, next)=>{
        res.status(200).json ({
            user: req.params.id
        })
    })

    app.get ('/',(req, res,next)=> {
        console.log('middleware Homepage')
        next()
    },(req, res,next)=>{
        console.log('Controller Homepage')
        res.status(200).json({
            message: "Bienvenu sur la page d'accueil"
        })
    })



    app.listen(PORT, ()=>{
        console.log('server running on port',PORT)
    })

    module.exports = app