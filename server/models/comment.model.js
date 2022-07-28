const mongoose = require('mongoose');

const CommentModel = mongoose.model('Comment',
    mongoose.Schema(
        {
            content: {
                type: String,
                required: true
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            ticket: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ticket",
                required: true
            },
            deleted: {
                type : Date,
                default: null
            }
        },
        { timestamps: true }
    )
);

module.exports = CommentModel;