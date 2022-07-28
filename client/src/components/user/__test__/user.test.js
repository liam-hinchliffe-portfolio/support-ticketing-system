import React from 'react';
import ReactDOM from 'react-dom';
import User from '../user';
import { BrowserRouter as Router } from "react-router-dom";
import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);

const mockUser = {
    "_id": "61505f709ff8982ce39511fb",
    "username": "Admin_User",
    "email": "admin@domain.com",
    "password": "$2a$10$IhJRD1T4gbVU/mSxqlfgP.m41CWB7ByIpvNEemlMYXkmuYpGFbutO",
    "type": "Admin",
    "deleted": null,
    "failedLogins": 0,
    "locked": false,
    "verified": true,
    "createdAt": "11/10/2021 16:17:52",
    "updatedAt": "11/10/2021 16:17:52",
    "__v": 0,
    "deletedAt": null
}

it("renders user without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <User user={mockUser} />
        </Router>
    ), div);
})

it("renders user correctly", () => {
    const { getByText } = render((
        <Router>
            <User user={mockUser} />
        </Router>
    ));
    expect(getByText("Locked: false")).toBeInTheDocument();
    expect(getByText("Username: Admin_User")).toBeInTheDocument();
    expect(getByText("Email: admin@domain.com")).toBeInTheDocument();
    expect(getByText("Type: Admin")).toBeInTheDocument();
    expect(getByText("Deleted: Not Deleted")).toBeInTheDocument();
    expect(getByText("Locked: false")).toBeInTheDocument();
    expect(getByText("Verified: true")).toBeInTheDocument();
})