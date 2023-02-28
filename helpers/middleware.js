const jwt = require('jsonwebtoken');

const {
    JWT_TOKEN
} = process.env;

module.exports = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const token = req.headers['authorization'] || req.query['code'];
        if (!token) {
            return res.status(401).json({ 
                status: false, 
                message: 'you\'re not authorized!' 
            });
        }

        const payload = jwt.verify(token, JWT_TOKEN);
        req.user = payload;

        if (roles.length > 0 && !roles.includes(payload.role)) {
            return res.status(401).json({ 
                status: false, 
                message: 'you\'re not authorized!' 
            });
        }

        next();
    };
};
