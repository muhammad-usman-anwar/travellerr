const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (!req.get('Token')) {
        const error = new Error('not authenticated')
        error.statusCode = 401
        throw error
    }
    const token = req.get('Token')
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'Allah is the greatest')
    } catch (error) {
        error.statusCode = 500
        throw error
    }
    if (!decodedToken) {
        const error = new Error('not authenticated')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}