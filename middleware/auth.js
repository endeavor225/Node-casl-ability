const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ACCESS_TOKEN_SECRET');
        const user = decodedToken;
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};