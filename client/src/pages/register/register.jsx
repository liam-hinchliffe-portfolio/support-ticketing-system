import React from "react";
import Header from "../../components/header/header";
import axios from 'axios';
import { Redirect } from "react-router";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.sendVerification = this.sendVerification.bind(this);
        this.register = this.register.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        this.startVerification = this.startVerification.bind(this);

        this.state = { validationErrors: [], verificationRequestId: null, userId: null };
        this.state.form = <div>
            <form id="registration-form" onSubmit={this.register} className="d-flex align-items-center justify-center flex-column">
                <div className="form-row d-flex align-items-center flex-wrap">
                    <label>Username</label>
                    <input name="username" placeholder="username..." />
                </div>
                <div className="form-row d-flex align-items-center flex-wrap">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="email@domain.com" />
                </div>
                <div className="form-row d-flex align-items-center flex-wrap">
                    <label>Password</label>
                    <input name="password" type="password" placeholder="Password" />
                </div>
                <button className="form-row">Next</button>
            </form>
        </div>;
    }

    startVerification() {
        this.setState({
            form: <form onSubmit={this.sendVerification} id="registration-form" className="d-flex align-items-center justify-center flex-column">
                <div className="form-row d-flex align-items-center flex-wrap">
                    <label>Mobile Number</label>
                    <input name="phone" type="number" placeholder="Mobile number..." min="0" />
                </div>
                <button className="form-row">Send Verification Code</button>
            </form>
        })
    }

    register(e) {
        e.preventDefault();

        const formData = {
            username: e.target.elements.username.value,
            email: e.target.elements.email.value,
            password: e.target.elements.password.value,
        }

        axios.post('/users', formData)
            .then(res => {
                this.setState({ validationErrors: [], userId: res.data._id });
                this.startVerification();
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

    verifyCode(e) {
        e.preventDefault();

        const formData = {
            requestId: this.state.verificationRequestId,
            userId: this.state.userId,
            token: e.target.elements.code.value,
        }

        axios.post('/users/verify', formData)
            .then((res) => {
                this.setState({ validationErrors: [], form: <Redirect to="/dashboard"></Redirect> })
            })
            .catch(err => {
                const validationErrors = [];
                if (err.response.data.msg && err.response.status !== 200) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });

    }

    sendVerification(e) {
        e.preventDefault();

        const formData = {
            phoneNumber: e.target.elements.phone.value,
        }

        axios.post('/users/sendVerification', formData)
            .then((res) => {
                this.setState({ validationErrors: [], verificationRequestId: res.data.id })
                this.setState({
                    form: <form onSubmit={this.verifyCode} id="registration-form" className="d-flex align-items-center justify-center flex-column">
                        <div className="form-row d-flex align-items-center flex-wrap">
                            <label>Verification Code</label>
                            <input name="code" type="number" placeholder="Verification code..." min="0" />
                        </div>
                        <button className="form-row">Verify</button>
                    </form>
                });
            })
            .catch(err => {
                const validationErrors = [];
                if (err.response.data.msg && err.response.status !== 200) validationErrors.push(err.response.data.msg)
                this.setState({ validationErrors });
            });
    }

    render() {
        return (
            <div>
                <Header navBar={false} />
                <div className="d-flex align-items-center justify-center flex-column">
                    <h2>Register</h2>
                    {this.state.form}
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

export default Register;