const UserModel = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const messagebird = require('messagebird')('QRpVZ2zEsXDdvGa9dR0woWqoc');

var params = {
    originator: '',
    type: 'sms'
};

/** Send verification code to user via SMS for 2FA */
exports.sendVerification = async (req, res) => {
    const { phoneNumber } = req.body;
    // Send verification code via SMS to user's phone number
    messagebird.verify.create(phoneNumber, params, (error, response) => {
        (error) ? res.status(500).json({ msg: "Could not send verification code", error }) : res.status(200).json(response);
    })
};

/** Verify the code that the user provides from SMS */
exports.verify = async (req, res) => {
    const { requestId, token, userId } = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (!user)
        res.status(404).json({ msg: "Could not find user" });

    // Verify the generated verification code against the verification code provided by user
    messagebird.verify.verify(requestId, token, (error, response) => {
        if (error) res.status(500).json({ msg: "Could not verify code" })

        try {
            Object.assign(user, { verified: true });
            user.save();
        } catch (error) {
            res.status(400).json({ msg: 'Could not update user' })
        }

        const payload = {
            user: {
                id: userId
            }
        };

        // 24 hours lifetime
        const expiryDate = new Date(Date.now() + 60 * 60 * 24 * 1000)

        // Create JWT authentication token and return cookie to client side
        jwt.sign(payload, process.env.JWTTOKEN, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: expiryDate
            }).status(200).json(user);
        });
    })
}

/** Create a new user (unverified) */
exports.create = async (req, res) => {
    const { username, email, password, type } = req.body;

    try {
        let user = await UserModel.findOne({ email });

        if (user)
            return res.status(400).json({ msg: "User already exists" });

        user = new UserModel({
            username,
            email,
            password,
            type,
        });

        // Hash and salt password for storing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).send({ msg: "Error registering user" , err});
    }
}

/** Create a user that is already verified by default (admin use only) */
exports.createVerified = async (req, res) => {
    const { username, email, password, type } = req.body;
    const authUser = await UserModel.findOne({ _id: req.user.id });

    if (!authUser) return res.status(401).json({ msg: "Unauthenticated to create verified user" })

    try {
        let user = await UserModel.findOne({ email });

        if (user)
            return res.status(400).json({ msg: "User already exists" });

        user = new UserModel({
            username,
            email,
            password,
            type,
            verified: true
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).send({ msg: "Error registering user" });
    }
}

/** Get all users */
exports.getAll = async (req, res) => {
    const authUser = await UserModel.findOne({ _id: req.user.id });
    let users;
    if (authUser.type === "Admin") {
        users = await UserModel.find({});
    } else res.status(403).json({ msg: "User is not authorised to access this data" })

    if (!users || users.length === 0) {
        res.status(404).json({ msg: 'Users not found!' })
    } else res.status(302).json(users);
};

/** Update a user */
exports.updateById = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;
    const authUser = await UserModel.findOne({ _id: req.user.id });
    const user = await UserModel.findOne({ _id: id });
    if (user) {
        if (authUser.type === "Admin") {
            try {
                Object.assign(user, req.body);
                user.save();
                res.status(202).json({ user });
            } catch (error) {
                res.status(400).json({ msg: 'Could not update user' })
            }
        } else res.status(403).json({ msg: "Unauthorised to update this user" })
    } else res.status(404).json({ msg: 'User not found' })

}

/** Mark a user as deleted */
exports.softDelete = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;
    const authUser = await UserModel.findOne({ _id: req.user.id });

    const user = await UserModel.findOne({ _id: id });
    if (user) {
        if (authUser.type === "Admin") {
            try {
                Object.assign(user, { 'deleted': Date.now(), 'status': 'Deleted' });
                user.save();
                res.status(202).json({ user });
            } catch (error) {
                res.status(204).json({ msg: 'User could not be deleted' });
            }
        } else res.status(403).json({ msg: "Unauthorised to delete this user" })
    } else res.status(404).json({ msg: 'User not found' })
}

/** Validate and verify user provided credentials to create login session */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({ msg: "User does not exist" });

        if (user.locked)
            return res.status(403).json({ msg: "Your account has been locked" });

        if (!user.verified)
            return res.status(403).json({ msg: "Your account has not been verified" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const failedLogins = user.failedLogins + 1;
            try {
                if (failedLogins === 5) user.locked = true
                user.failedLogins = failedLogins;
                await user.save();

                return res.status(401).json({ msg: `Incorrect password. You have ${5 - user.failedLogins} more attempts` });
            } catch (error) {
                return res.status(500).json({ msg: "Could not update failed logins" });
            }
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        // 24 hours lifetime
        const expiryDate = new Date(Date.now() + 60 * 60 * 24 * 1000)
        // Return JWT authentication token and cookie to client-side
        jwt.sign(payload, process.env.JWTTOKEN, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: expiryDate
            }).status(200).json(user);
        });
    } catch (e) {
        res.status(500).json({ msg: "Failed to attempt login" });
    }
};

/** Get authenticated user */
exports.getAuth = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await UserModel.findOne({ _id: id });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ msg: "User cannot be found" })
    }
}

/** End the login session */
exports.logout = async (req, res) => {
    res.clearCookie("token").status(200).json({ msg: "Logged out user" });
}