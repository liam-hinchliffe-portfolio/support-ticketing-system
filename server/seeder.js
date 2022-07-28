const mongoose = require('mongoose');
const UserModel = require('./models/user.model');
const TicketModel = require('./models/ticket.model');
const CommentModel = require('./models/comment.model');

mongoose.connect('mongodb://localhost:27017/ticketingsystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const adminUser = new UserModel({
        _id: "61505f709ff8982ce39511fb",
        username: "Admin_User",
        email: "admin@domain.com",
        password: "$2a$10$IhJRD1T4gbVU/mSxqlfgP.m41CWB7ByIpvNEemlMYXkmuYpGFbutO",
        type: "Admin",
        verified: true
    });
    await adminUser.save();

    const supportUser = new UserModel({
        _id: "61444dbbca7c1282d172af2c",
        username: "Support_User",
        email: "support@domain.com",
        password: "$2a$10$IhJRD1T4gbVU/mSxqlfgP.m41CWB7ByIpvNEemlMYXkmuYpGFbutO",
        type: "Support",
        verified: true
    })
    await supportUser.save();

    const customerUser = new UserModel({
        _id: "61444f25ec68780539442585",
        username: "Customer_User",
        email: "customer@domain.com",
        password: "$2a$10$IhJRD1T4gbVU/mSxqlfgP.m41CWB7ByIpvNEemlMYXkmuYpGFbutO",
        verified: true
    })
    await customerUser.save();

    const unverifiedUser = new UserModel({
        _id: "61444f25ec68780539442589",
        username: "Unverified_User",
        email: "unverified@domain.com",
        password: "$2a$10$IhJRD1T4gbVU/mSxqlfgP.m41CWB7ByIpvNEemlMYXkmuYpGFbutO",
        verified: false
    })
    await unverifiedUser.save();

    const ticketWithoutComments = new TicketModel({
        "_id": "6153639b1d478b9dfce9a115",
        "title": "Ticket Without Comments",
        "description": "No comments here",
        "comments": [],
        "status": "Open",
        "deleted": null,
        "author": customerUser._id,
    })
    await ticketWithoutComments.save();

    
    const closedTicket = new TicketModel({
        "_id": "615362921d478b9dfce9a0fa",
        "title": "Closed Ticket",
        "description": "This is a closed ticket",
        "comments": [],
        "status": "Closed",
        "deleted": null,
        "author": customerUser._id,
    })
    await closedTicket.save();

    const ticketWithComments = new TicketModel({
        "_id": "61445d147f4ae2d2b9565772",
        "title": "Ticket with Comments",
        "description": "This is ticket has comments",
        "comments": [],
        "status": "Open",
        "deleted": null,
        "author": customerUser._id,
    })
    await ticketWithComments.save();

    const commentOne = new CommentModel({
        "_id": "61545d0c35a77ec229f11f02",
        "content": "Hi, how can we help you?",
        "deleted": null,
        "author": supportUser._id,
        "ticket": ticketWithComments._id
    })
    await commentOne.save()
    await TicketModel.findOneAndUpdate({ _id: ticketWithComments._id }, { $push: { comments: commentOne._id } }, { new: true });

    const commentTwo = new CommentModel({
        "_id": "61545c63de726b7f304feba2",
        "content": "I need help with my account",
        "deleted": null,
        "author": customerUser._id,
        "ticket": ticketWithComments._id
    })
    await commentTwo.save()
    await TicketModel.findOneAndUpdate({ _id: ticketWithComments._id }, { $push: { comments: commentTwo._id } }, { new: true });
});