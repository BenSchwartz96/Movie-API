const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken');
const passport= require('passport');

require('./passport');


/**
 * Creates JWT which expires in 7 dats, encoded using a 'HS256' algorithm
 * @param {object} user
 * @returns User object with JWT, and additional information on token
 * @function generateJWTToken
 */
let generateJWTToken = (user) => {
    return jwt.sign(user,jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}


/**
 * POST request to log in a user, generating a JWT token upon login
 * @name postLogin
 * @kind function
 * @param router
 * @returns User object with JWT
 * @requires passport
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token});
            });
        })(req, res);
    });
}