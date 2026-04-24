const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { body, validationResult } = require('express-validator')
const initRoutes = require('./routes')

const PORT = process.env.PORT || 3000

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))

initRoutes(app)

app.listen(PORT, ()=>{
    console.log('server running on port', PORT)
})

module.exports = app