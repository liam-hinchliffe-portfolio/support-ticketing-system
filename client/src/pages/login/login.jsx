import React from "react";
import Header from "../../components/header/header";
import axios from 'axios';
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validationErrors: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value
    }

    axios.post('/users/login', formData)
      .then((res) => {
        this.setState({ validationErrors: [] })
        localStorage.setItem("authenticated", true);
        localStorage.setItem("type", res.data.type);
        window.location.href = "/dashboard";
      })
      .catch(err => {
        const validationErrors = [];

        const errors = err.response.data.errors;

        if (errors && Array.isArray(errors)) {
          errors.forEach((error, index) => {
            if (errors[index].password) {
              validationErrors.push(errors[index].password);
            } else if (errors[index].email) validationErrors.push(errors[index].email)
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
        <Header navBar={false} />
        <div className="d-flex align-items-center justify-center flex-column">
          <h2>Login</h2>
          <form onSubmit={this.handleSubmit} className="d-flex align-items-center justify-center flex-column">
            <div className="form-row d-flex align-items-center flex-wrap">
              <label>Email</label>
              <input name="email" type="email" placeholder="email@domain.com" />
            </div>
            <div className="form-row d-flex align-items-center flex-wrap">
              <label>Password</label>
              <input name="password" type="password" placeholder="Password" />
            </div>
            <button>Login</button>
            <p>Need to register? <Link to="./register"><span className="hyperlink">Sign up</span></Link></p>
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

export default Login;