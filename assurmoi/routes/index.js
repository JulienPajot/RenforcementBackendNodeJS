const userRoutes = require('./users')

function initRoutes(app){

    app.use('/user',userRoutes)

    app.get ('/',(req, res,next)=> {
        console.log('middleware Homepage')
        next()
    },(req, res,next)=>{
        console.log('Controller Homepage')
        res.status(200).json({
            message: "Bienvenu sur la page d'accueil"
        })
    })
}

module.exports = initRoutes