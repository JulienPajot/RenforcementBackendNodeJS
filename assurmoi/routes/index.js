const userRoutes = require('./users')
const authRoutes = require('./auth')
const sinisterRoutes = require('./sinisters')
const documentRoutes = require('./documents')
const requestRoutes = require('./requests')
const workflowRoutes = require('./workflow')

function initRoutes(app){

    app.use('/user',userRoutes)
    app.use('/auth', authRoutes)
    app.use('/sinister', sinisterRoutes)
    app.use('/document', documentRoutes)
    app.use('/request', requestRoutes)
    app.use('/workflow', workflowRoutes)

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