import React from "react";
import Logo from '../../images/logo.png';
import './header.css';
import { Link } from "react-router-dom";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        fetch("/users/logout")
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem("authenticated", null);
                    localStorage.setItem("type", null);
                    window.location.href = "/login";
                }
            })
    }

    render() {
        const navBar = this.props.navBar != false ? (<div data-testid="header-navbar" className="nav-items d-flex align-items-center justify-space-between flex-wrap">
            <Link to="/dashboard"><button className="nav-item">Dashboard</button></Link>
            {localStorage.getItem("type") === "Admin" ? <Link to="/users"><button className="nav-item">Users</button></Link> : null}
            <button className="nav-item" onClick={this.logout}>Logout</button>
        </div>) : null;

        return (
            <header>
                <div className="d-flex align-items-center">
                    <Link to="/"><img alt="logo" className="logo" src={Logo} /></Link>
                    {navBar}
                </div>
            </header>
        );
    }
}

export default Header;