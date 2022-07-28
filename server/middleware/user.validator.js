const { body, validationResult } = require('express-validator')
const jwt = require("jsonwebtoken");
const UserModel = require('../models/user.model');

const userRegistrationValidation = () => {
    return [
        body('username').isLength({ min: 6 }).withMessage("Username must be at least 6 characters"),
        body('email').isEmail().withMessage("Invalid email format"),
        body('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").matches("[0-9]").withMessage("Password must contain at least one number").matches("[A-Z]").withMessage("Password must contain at least one uppercase character").matches("[a-z]").withMessage("Password must contain at least one lowercase character")
    ]
}

const userLoginValidation = () => {
    return [
        body('email').isEmail().withMessage("Invalid email format"),
        body('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").matches("[0-9]").withMessage("Password must contain at least one number").matches("[A-Z]").withMessage("Password must contain at least one uppercase character").matches("[a-z]").withMessage("Password must contain at least one lowercase character")
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No authentication in request" });

    try {
        const decodedToken = jwt.verify(token, process.env.JWTTOKEN);
        req.user = decodedToken.user;
        const authUser = await UserModel.findOne({ _id: req.user.id });

        authUser.locked == false && authUser.verified == true ? next() : res.status(403).send({ msg: "Your account is locked or unverified" });
    } catch (e) {
        res.status(401).send({ msg: "Invalid authentication token" });
    }
};

const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No authentication in request" });

    try {
        const decodedToken = jwt.verify(token, process.env.JWTTOKEN);
        req.user = decodedToken.user;
        const authUser = await UserModel.findOne({ _id: req.user.id });
        authUser.type === "Admin" ? next() : res.status(403).send({ msg: "Unauthorised to access this request" })
    } catch (e) {
        res.status(401).send({ msg: "Invalid authentication token" });
    }
};

module.exports = {
    userRegistrationValidation,
    validate,
    userLoginValidation,
    authenticate,
    authenticateAdmin
}