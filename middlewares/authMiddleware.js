const jwt = require('jsonwebtoken');
const secret = require('../crypto/config');

function verifyToken(req, res, next) {
    console.log(req);
    const token = req.session.token;
    console.log(req.session);
    if (!token) {
        return res.status(401).json({ message: 'Token not generated. '});
    }

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Token not valid. '});
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = verifyToken;
