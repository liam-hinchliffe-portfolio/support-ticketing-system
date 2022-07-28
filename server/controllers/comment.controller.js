const CommentModel = require('../models/comment.model');
const TicketModel = require('../models/ticket.model');
const UserModel = require('../models/user.model');

/** Create a new comment and attach it to a ticket */
exports.create = async (req, res) => {
    // Get model properties from post
    const { content, ticket } = req.body;

    const authUser = await UserModel.findOne({ _id: req.user.id });
    try {
        const ticketModel = await TicketModel.findOne({ _id: ticket });
        if (ticketModel) {
            // Only allow owner of ticket or Support user or Admin user to add comment
            if (authUser && parseInt(ticketModel.author) === parseInt(authUser._id) || authUser.type !== "Customer") {
                const comment = new CommentModel({ content, author: authUser._id, ticket: ticketModel._id });
                const response = await comment.save();

                // Update ticket's comment relationship
                await TicketModel.findOneAndUpdate({ _id: ticket }, { $push: { comments: comment._id } }, { new: true });

                res.status(201).json(response);
            } else res.status(403).json({ msg: "User not authenticated to add comment to this ticket" })
        } else res.status(404).json({ msg: 'Ticket not found' })
    } catch (error) {
        res.status(500).json({ msg: 'Could not create comment', error })
    }
}

/** Update a comment */
exports.updateById = async (req, res) => {
    // Get model properties from url variables
    const { id } = req.params;

    const authUser = await UserModel.findOne({ _id: req.user.id });
    const comment = await CommentModel.findOne({ _id: id });
    if (comment) {
        // Only allow comment owner, or Support or Admin user to update a comment
        if (parseInt(comment.author) === parseInt(authUser._id) || authUser.type !== "Customer") {
            try {
                Object.assign(comment, req.body);
                comment.save();
                res.status(202).json({ comment });
            } catch (error) {
                res.status(204).json({ msg: 'Could not update comment' })
            }
        } else res.status(403).json({ msg: "User not authorised to update this comment" })
    } else res.status(404).json({ msg: 'Comment not found' })
}

/** Mark a comment as deleted */
exports.softDelete = async (req, res) => {
    // Get model properties from post
    const { id } = req.params;

    const authUser = await UserModel.findOne({ _id: req.user.id });

    const comment = await CommentModel.findOne({ _id: id });
    if (comment) {
        // Only allow comment owner, or Support or Admin user to delete a comment
        if (parseInt(comment.author) === parseInt(authUser._id) || authUser.type !== "Customer") {
            try {
                Object.assign(comment, { 'deleted': Date.now() });
                comment.save();
                res.status(202).json({ comment });
            } catch (error) {
                res.status(204).json({ msg: 'Comment could not be deleted' });
            }
        } else res.status(403).json({ msg: "Not authenticated to delete comment" })
    } else res.status(404).json({ msg: 'Comment not found' })
}