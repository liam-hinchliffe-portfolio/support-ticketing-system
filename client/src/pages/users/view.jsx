import React from "react";
import Header from "../../components/header/header";
import UserPreview from "../../components/user/user";

class ViewUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
        this.newUserRedirect = this.newUserRedirect.bind(this);
    }

    componentDidMount() {
        fetch("/users")
            .then(res => res.text())
            .then(res => this.setState({ users: JSON.parse(res) }))
    }

    newUserRedirect() {
        window.location.href = "/users/create";
    }

    render() {
        return (
            <div>
                <Header />
                <h2>Users</h2>
                <button onClick={this.newUserRedirect}>New User</button>
                {this.state.users.map(user => (
                    <UserPreview key={user._id} user={user} />
                ))}
            </div>
        );
    }
}

export default ViewUsers;