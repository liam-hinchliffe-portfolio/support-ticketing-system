import React from "react";
import './ticket.css';
import axios from 'axios';

const dateToString = (dateObj) => `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;

class TicketPreview extends React.Component {

    constructor(props) {
        super(props);
        this.statusSelector = React.createRef();
        this.delete = this.delete.bind(this);
        this.view = this.view.bind(this);
        this.restore = this.restore.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.state = { buttons: null, ticket: {}, validationErrors: [] };
        this.restoreTicketBtn = <button onClick={this.restore}>Restore</button>;
        this.deletedDate = (this.state.ticket.deleted) ? <p>Deleted: {dateToString(new Date(this.state.ticket.deleted))}</p> : null;
    }

    view() {
        window.location.href = `/tickets/${this.state.ticket._id}/view`;
    }

    updateStatus(status) {
        const updateData = {
            status
        }

        axios.put(`/tickets/${this.props.ticket._id}`, updateData)
            .then(res => this.setState({ ticket: this.convertISOTimes(res.data.ticket) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    convertISOTimes(ticket) {
        const createdAt = dateToString(new Date(ticket.createdAt));
        const updatedAt = dateToString(new Date(ticket.updatedAt));
        const deletedAt = (ticket.deleted) ? <p>Deleted: {dateToString(new Date(ticket.deleted))}</p> : null;
        ticket.createdAt = createdAt;
        ticket.updatedAt = updatedAt;
        ticket.deletedAt = deletedAt;

        return ticket;
    }

    restore() {
        const updateData = {
            deleted: null,
            status: "Open"
        }
        axios.put(`/tickets/${this.props.ticket._id}`, updateData)
            .then(res => this.setState({ buttons: this.actionBtns, ticket: this.convertISOTimes(res.data.ticket) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    delete() {
        axios.delete(`/tickets/${this.props.ticket._id}`)
            .then(res => this.setState({ buttons: this.restoreTicketBtn, ticket: this.convertISOTimes(res.data.ticket) }))
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    componentDidMount() {
        const ticket = this.convertISOTimes(this.props.ticket);
        this.setState({ ticket });

        if (ticket.status === "Deleted" && ticket.deleted) {
            this.setState({ buttons: this.restoreTicketBtn })
        } else this.setState({ buttons: this.actionBtns })
    }

    render() {
        return (
            <div className="d-flex align-items-center ticket-preview-row justify-space-between flex-wrap">
                <div className="d-flexflex-column flex-wrap">
                    <p>Title: {this.state.ticket.title}</p>
                    <p>Description: {this.state.ticket.description}</p>
                </div>
                <div className="d-flexflex-column flex-wrap">
                    <p>Status: {this.state.ticket.status}</p>
                    {this.state.ticket.deletedAt}
                    <p>Opened At: {this.state.ticket.createdAt}</p>
                    <p>Last Updated: {this.state.ticket.updatedAt}</p>
                </div>
                {this.state.ticket.status === "Deleted" ? <button onClick={this.restore}>Restore</button> :
                    <div className="d-flexflex-column flex-wrap">
                        <button onClick={this.view}>View</button>
                        <button onClick={this.delete}>Delete</button>
                        {this.state.ticket.status === "Closed" ? <button onClick={() => { this.updateStatus("Open") }}>Open</button> : <button onClick={() => { this.updateStatus("Closed") }}>Close</button>}
                    </div>
                }

                {
                    this.state.validationErrors.map((error, index) => {
                        return <p key={index} className="validation-error">{error}</p>;
                    })
                }
            </div>
        );
    }
}

export default TicketPreview;