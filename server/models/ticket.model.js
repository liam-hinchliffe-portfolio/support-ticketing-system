const mongoose = require('mongoose');

const TicketModel = mongoose.model('Ticket',
    mongoose.Schema(
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            comments: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
                required: true
            }],
            status: {
                type: String,
                enum: ['Open', 'Closed', 'Deleted'],
                default: 'Open'
            },
            deleted: {
                type : Date,
                default: null
            }
        },
        { timestamps: true }
    )
);

module.exports = TicketModel;