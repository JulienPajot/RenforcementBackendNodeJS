const {createTransport} = require('nodemailer')

const transporter = createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

// Fonction asynchrone pour envoyer un mail
async function sendMail(to, subject, text, html = null) {
    try {
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: error.message }
    }
}

async function sendLoginAlertEmail(user) {
    try {
        const mailStatus = await mailer.sendMail(
            user.email,
            'New login to your account',
            `A new login to your account was detected at ${new Date().toLocaleString()}. If this was not you, please change your password immediately.`
        );

        if (!mailStatus.success) {
            console.error('Error sending login email:', mailStatus.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Unexpected error while sending login email:', error);
        return false;
    }
}

module.exports = { sendMail,sendLoginAlertEmail }