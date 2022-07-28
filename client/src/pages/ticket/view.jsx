import axios from "axios";
import React from "react";
import Comment from "../../components/comment/comment";
import Header from "../../components/header/header";
import "./ticket.css";

class ViewTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validationErrors: [], ticket: { comments: [] }, newCommentForm: null };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            content: e.target.elements.comment.value,
            ticket: this.state.ticket._id
        }

        axios.post('/comments', formData)
            .then((res) => {
                const ticket = this.state.ticket;
                ticket.comments.push(res.data);
                this.setState({ ticket })
            })
            .catch(err => {
                const validationErrors = [];

                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    componentDidMount() {
        axios.get(`/tickets/${this.props.match.params.id}`)
            .then((res) => {
                this.setState({ ticket: res.data });
                const newCommentForm = (this.state.ticket.status === "Open") ? <div><h4>New Comment</h4><form onSubmit={this.handleSubmit} className="d-flex align-items-center justify-center flex-column">
                    <div className="form-row d-flex align-items-center flex-wrap">
                        <textarea required name="comment"></textarea>
                    </div>
                    <button>Create</button>
                </form></div> : null;
                this.setState({newCommentForm})
            })
            .catch(err => {
                const validationErrors = [];
                if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="d-flex align-items-center justify-center flex-column">
                    <h2>{this.state.ticket.title} <small>({this.state.ticket.status})</small></h2>
                    <p>{this.state.ticket.description}</p>
                    <div className="comments-container">
                        {
                            this.state.ticket.comments.map((comment, index) => {
                                return (
                                    <Comment key={comment._id} comment={comment} />
                                )
                            })
                        }
                    </div>
                    {this.state.newCommentForm}
                    {
                        this.state.validationErrors.map((error, index) => {
                            return <p key={index} className="validation-error">{error}</p>;
                        })
                    }
                </div>
            </div>
        );
    }
}

export default ViewTicket;