import axios from "axios";
import React from "react";
import './comment.css';

const dateToString = (dateObj) => `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comment: {}, showButtons: null, validationErrors: [] };
        this.delete = this.delete.bind(this);
        this.restore = this.restore.bind(this);
        this.deleteBtn = <button onClick={this.delete}>Delete</button>;
        this.restoreBtn = <button onClick={this.restore}>Restore</button>
    }

    delete() {
        axios.delete(`/comments/${this.props.comment._id}`)
            .then(res => this.setState({ showButtons: this.restoreBtn, comment: this.convertISOTimes(res.data.comment) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    restore() {
        const updateData = {
            deleted: null,
        }
        axios.put(`/comments/${this.props.comment._id}`, updateData)
            .then(res => this.setState({ showButtons: this.deleteBtn, comment: this.convertISOTimes(res.data.comment) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    convertISOTimes(comment) {
        const createdAt = dateToString(new Date(comment.createdAt));
        const deletedAt = (comment.deleted) ? <p>Deleted: {dateToString(new Date(comment.deleted))}</p> : null;
        comment.createdAt = createdAt;
        comment.deletedAt = deletedAt;

        return comment;
    }

    componentDidMount() {
        this.setState({ comment: this.convertISOTimes(this.props.comment) })
        if (this.props.comment.deleted) {
            this.setState({ showButtons: this.restoreBtn })
        } else this.setState({ showButtons: this.deleteBtn });
    }

    render() {
        return (
            <div className="comment">
                <p>Content: {this.state.comment.content}</p>
                <p>Created: {this.state.comment.createdAt}</p>
                {this.state.comment.deletedAt}
                <hr />
                {this.state.showButtons}
                {
                    this.state.validationErrors.map((error, index) => {
                        return <p key={index} className="validation-error">{error}</p>;
                    })
                }
            </div>
        );
    }
}

export default Comment;