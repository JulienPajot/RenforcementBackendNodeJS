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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.reset_token = resetToken;
    user.reset_token_exp = Date.now() + 1000 * 60 * 15; 

    await user.save();

    return res.status(200).json({
      message: "Reset token generated",
      resetToken, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: { reset_token: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (Date.now() > user.reset_token_exp) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_exp = null;

    await user.save();

    return res.status(200).json({
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login,logout,forgotPassword,resetPassword }