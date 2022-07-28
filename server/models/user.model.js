const mongoose = require('mongoose');

const UserModel = mongoose.model('User',
    mongoose.Schema(
        {
            username: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            type: {
                type: String,
                enum: ['Customer', 'Support', 'Admin'],
                default: 'Customer'
            },
            deleted: {
                type : Date,
                default: null
            },
            failedLogins: {
                type: Number,
                default: 0
            },
            locked: {
                type: Boolean,
                default: false
            },
            verified: {
                type: Boolean,
                default: false
            }
        },
        { timestamps: true, strict: true }
    )
);

module.exports = UserModel;