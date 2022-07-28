import React from "react";
import './user.css';
import axios from 'axios';

const dateToString = (dateObj) => `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;

class UserPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { buttons: null, user: {}, validationErrors: [] };
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
        this.delete = this.delete.bind(this);
        this.restore = this.restore.bind(this);
        this.actionButtons =
            <div>
                <button onClick={this.delete}>Delete</button>
                <button onClick={this.unlock}>Unlock</button>
                <button onClick={this.lock}>Lock</button>
            </div>
        this.restoreButton = <button onClick={this.restore}>Restore</button>
    }

    convertISOTimes(user) {
        const createdAt = dateToString(new Date(user.createdAt));
        const updatedAt = dateToString(new Date(user.updatedAt));
        const deletedAt = (user.deleted) ? dateToString(new Date(user.deleted)) : null;
        user.createdAt = createdAt;
        user.updatedAt = updatedAt;
        user.deletedAt = deletedAt;

        return user;
    }

    componentDidMount() {
        const user = this.convertISOTimes(this.props.user);
        if (user.deleted) {
            user.deleted = dateToString(new Date(user.deleted));
            this.setState({ buttons: this.restoreButton })
        } else this.setState({ buttons: this.actionButtons })
        this.setState({ user });
    }

    restore() {
        const updateData = {
            deleted: null
        }
        axios.put(`/users/${this.state.user._id}`, updateData)
            .then(res => this.setState({ buttons: this.actionButtons, user: this.convertISOTimes(res.data.user) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    lock() {
        if (this.state.user.locked) alert("User is already locked");
        const updateData = {
            locked: true
        }
        axios.put(`/users/${this.state.user._id}`, updateData)
            .then(res => this.setState({ user: this.convertISOTimes(res.data.user) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    unlock() {
        if (!this.state.user.locked) alert("User is already unlocked");

        const updateData = {
            locked: false
        }
        axios.put(`/users/${this.state.user._id}`, updateData)
            .then(res => this.setState({ user: this.convertISOTimes(res.data.user) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    delete() {
        axios.delete(`/users/${this.state.user._id}`)
            .then(res => this.setState({ buttons: this.restoreButton, user: this.convertISOTimes(res.data.user) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    render() {
        return (
            <div className="d-flex align-items-center user-row justify-space-between flex-wrap">
                <div className="d-flex flex-column flex-wrap">
                    <p>Username: {this.state.user.username}</p>
                    <p>Email: {this.state.user.email}</p>
                    <p>Type: {this.state.user.type}</p>
                    <p>Deleted: {this.state.user.deletedAt ?? "Not Deleted"}</p>
                    <p>Locked: {String(this.state.user.locked)}</p>
                    <p>Verified: {String(this.state.user.verified)}</p>
                </div>
                <div className="d-flex flex-column flex-wrap">
                    {this.state.buttons}
                </div>
                {
                    this.state.validationErrors.map((error, index) => {
                        return <p key={index} className="validation-error">{error}</p>;
                    })
                }
            </div>
        );
    }
}

export default UserPreview;