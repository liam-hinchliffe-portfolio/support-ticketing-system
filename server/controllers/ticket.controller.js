const TicketModel = require('../models/ticket.model');
const UserModel = require('../models/user.model');

/** Create a new ticket */
exports.create = async (req, res) => {
    // Get model properties from post
    const { title, description } = req.body;

    const authUser = await UserModel.findOne({ _id: req.user.id });

    if (authUser) {
        try {
            const ticket = new TicketModel({ title, description });
            ticket.author = authUser._id;

            const response = await ticket.save();
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ msg: 'Could not create ticket' })
        }
    } else res.status(401).json({ msg: "Not authenticated user" })
}

/** Update a ticket */
exports.getById = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;

    const authUser = await UserModel.findOne({ _id: req.user.id });
    if (authUser) {
        // Get ticket with it's author (user) and comments (comment) relationships populated
        const ticket = await TicketModel.findOne({ _id: id }).populate('author').populate('comments');
        if (ticket) {
            // Only allow author of ticket or Support or Admin user to retrieve ticket details
            if (parseInt(ticket.author._id) === parseInt(authUser._id) || authUser.type !== "Customer") {
                res.status(200).json(ticket)
            } else res.status(403).json({ msg: "User not authorised for request" })
        } else res.status(404).json({ msg: 'Ticket not found' });
    } else return res.status(401).json({ msg: "No authenticated user" })
}

/** Get all of the tickets for the authenticated user - response varies based on user permissions */
exports.getAll = async (req, res) => {
    const authUser = await UserModel.findOne({ _id: req.user.id });
    let tickets;
    // If authenticated user is a customer then return their tickets only
    if (authUser.type === "Customer") {
        tickets = await TicketModel.find({ author: authUser._id }).sort({ "deleted": null, "createdAt": -1 }).populate('author').populate('comments');
    
    // If authenticated user is support or admin user then return all tickets
    } else tickets = await TicketModel.find().sort({ "deleted": null, "createdAt": -1 }).populate('author').populate('comments');
    if (!tickets || tickets.length === 0) {
        res.status(404).json({ msg: 'Tickets not found' })
    } else res.status(302).json(tickets);
};

/** Update a ticket */
exports.updateById = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;
    const authUser = await UserModel.findOne({ _id: req.user.id });

    const ticket = await TicketModel.findOne({ _id: id });
    if (ticket) {
        // Only allow author of ticket or support or admin user to update a ticket
        if (parseInt(ticket.author) === parseInt(authUser._id) || authUser.type !== "Customer") {
            try {
                Object.assign(ticket, req.body);
                ticket.save();
                res.status(202).json({ ticket });
            } catch (error) {
                res.status(400).json({ msg: 'Could not update ticket' })
            }
        } else res.status(403).json({ msg: "Unauthorised to update this ticket" })
    } else res.status(404).json({ msg: 'Ticket not found' })
}

/** Mark a ticket as deleted */
exports.softDelete = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;
    const authUser = await UserModel.findOne({ _id: req.user.id });

    const ticket = await TicketModel.findOne({ _id: id });
    if (ticket) {
        // Only allow author of ticket or support or admin user to delete a ticket
        if (parseInt(ticket.author) === parseInt(authUser._id) || authUser.type !== "Customer") {
            try {
                Object.assign(ticket, { 'deleted': Date.now(), 'status': 'Deleted' });
                ticket.save();
                res.status(202).json({ ticket });
            } catch (error) {
                res.status(204).json({ msg: 'Ticket could not be deleted' });
            }
        } else res.status(403).json({ msg: "Unauthorised to delete this ticket" })
    } else res.status(404).json({ msg: 'Ticket not found' })
}