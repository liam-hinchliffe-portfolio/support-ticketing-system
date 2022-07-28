import axios from "axios";
import React from "react";
import Header from "../../components/header/header";

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validationErrors: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            username: e.target.elements.username.value,
            email: e.target.elements.email.value,
            type: e.target.elements.type.value,
            password: e.target.elements.password.value,
            confirmPassword: e.target.elements['confirm-password'].value,
        }

        if (formData.password !== formData.confirmPassword) {
            const validationErrors = [];
            validationErrors.push("Password and confirmation password must match")
            this.setState({ validationErrors });
            return
        }

        axios.post('/users/verified', formData)
            .then((res) => {
                this.setState({ validationErrors: [] })
                window.location.href = "/users";
            })
            .catch(err => {
                const validationErrors = [];
                if (!err || !err.response) return;

                const errors = err.response.data.errors;

                if (errors && Array.isArray(errors)) {
                    errors.forEach((error, index) => {
                        if (errors[index].password) {
                            validationErrors.push(errors[index].password);
                        } else if (errors[index].email) {
                            validationErrors.push(errors[index].email)
                        } else if (errors[index].username) {
                            validationErrors.push(errors[index].username)
                        }
                    })
                } else if (err.response.data.msg && err.response.status !== 200) {
                    if (err.response.data.msg) validationErrors.push(err.response.data.msg)
                }
                this.setState({ validationErrors });
            });

    }

    render() {
        return (
            <div>
                <Header />
                <div className="d-flex align-items-center justify-center flex-column">
                    <h2>New User</h2>
                    <form onSubmit={this.handleSubmit} className="d-flex align-items-center justify-center flex-column">
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Username</label>
                            <input required name="username" placeholder="Username..." />
                        </div>
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Email</label>
                            <textarea required name="email" type="email" placeholder="Email..."></textarea>
                        </div>
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Type</label>
                            <select name="type">
                                <option value="Customer">Customer</option>
                                <option value="Support">Support</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Password</label>
                            <input required name="password" type="password" placeholder="Password..." />
                        </div>
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Confirm Password</label>
                            <input required name="confirm-password" type="password" placeholder="Re-enter password..." />
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

export default CreateUser;