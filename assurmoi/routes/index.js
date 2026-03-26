const userRoutes = require('./users')
const sinisterRoutes = require('./sinisters')
const documentRoutes = require('./documents')
const requestRoutes = require('./requests')
const historiesRoutes = require('./histories')
const workflowRoutes = require('./workflows')
const authRoutes = require('./auth')



function initRoutes(app){

    app.use('/user',userRoutes)
    app.use('/sinisters', sinisterRoutes)
    app.use('/documents', documentRoutes)
    app.use('/requests', requestRoutes)
    app.use('/histories', historiesRoutes)
    app.use('/workflows', workflowRoutes)
    app.use('/auth',authRoutes)
    
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