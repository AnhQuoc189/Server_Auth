const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { constants } = require('../constants/httpStatus');
const UserModel = require('../models/userModel');
const { TokenExpiredError } = jwt;

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];

        if (!token) {
            res.status(constants.UNAUTHORIZED);
            throw new Error('User is not authorized or token is missing');
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(constants.UNAUTHORIZED);
                throw new Error('User is not authorized');
            } else {
                req.user = decoded.user;
                next();
            }
        });
    }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                if (error instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(401);
                throw new Error('User is not authorized');
            }

            const user = decoded.user;
            //check admin role
            if (user.userType === 'Admin') {
                next();
            } else {
                res.status(403);
                throw new Error('You do not have permission to do that.');
            }
        });

        if (!token) {
            res.status(401);
            throw new Error('User is not authorized or token is missing');
        }
    }
});

const verifyUserAuthorization = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                if (error instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(401);
                throw new Error('User is not authorized');
            }

            const user = decoded.user;
            //check admin role
            if (user.id === req.params.id || user.userType === 'Admin') {
                req.user.checkMySelf = true;
                next();
            } else {
                res.status(403);
                throw new Error('You do not have permission to do that.');
            }
        });

        if (!token) {
            res.status(401);
            throw new Error('User is not authorized or token is missing');
        }
    }
});

const verifyUser = asyncHandler(async (req, res, next) => {
    const { email } = req.method === 'GET' ? req.query : req.body;
    if (!email) {
        res.status(constants.BAD_REQUEST);
        throw new Error('email Empty');
    }
    const existEmail = await UserModel.findOne({ email });
    if (!existEmail) {
        res.status(constants.NOT_FOUND);
        throw new Error('email does not exists');
    }
    next();
});

const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };

    next();
};

module.exports = {
    verifyAccessToken,
    verifyAdmin,
    verifyUserAuthorization,
    localVariables,
    verifyUser,
};
