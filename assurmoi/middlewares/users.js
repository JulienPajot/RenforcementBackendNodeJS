const { checkSchema } = require('express-validator');

async function validateUsername(req, res, next) {
    const [hasError] = await checkSchema({
        username: {
            notEmpty: true
        },
    }).run(req)
    if (hasError.isEmpty()){
        next();
    }
    res.status(403).json({
        message: "Missing username"
    })
}

module.exports = {
    validateUsername
};