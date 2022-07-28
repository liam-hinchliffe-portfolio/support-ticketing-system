import axios from "axios";
import React from "react";
import Header from "../../components/header/header";

class CreateTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validationErrors: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            title: e.target.elements.title.value,
            description: e.target.elements.description.value,
        }

        axios.post('/tickets', formData)
            .then((res) => {
                this.setState({ validationErrors: [] })
                window.location.href = "/dashboard";
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
                    <h2>New Ticket</h2>
                    <form onSubmit={this.handleSubmit} className="d-flex align-items-center justify-center flex-column">
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Title</label>
                            <input required name="title" placeholder="Title..." />
                        </div>
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Description</label>
                            <textarea required name="description" placeholder="Description..."></textarea>
                        </div>
                        <button>Create</button>
                        {
                            this.state.validationErrors.map((error, index) => {
                                return <p key={index} className="validation-error">{error}</p>;
                            })
                        }
                    </form>
                </div>

            </div>
        );
    }
}

export default CreateTicket;