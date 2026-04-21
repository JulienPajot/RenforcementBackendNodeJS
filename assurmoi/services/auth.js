const {User} = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendLoginAlertEmail} = require('../utils/mailer')

require('dotenv').config()

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ 
            where: { 
                username: username
            } 
        })
        
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' })

        const token = jwt.sign({ user: user.clean() }, process.env.SECRET_KEY, { expiresIn: '1h' })

        user.token = token
        user.save() 

        await sendLoginAlertEmail(user)

        return res.status(200).json({
            token
        })

    } catch (error) {
        console.error('Error during login:', error)
    }
}

const   logout = async (req, res) => {
    req.user.token = null
    req.user.save();

    return res.status(200).json({ message: 'unlogged !'});
}

module.exports = { login,logout }