import React from 'react';
import ReactDOM from 'react-dom';
import Ticket from '../ticket';
import { BrowserRouter as Router } from "react-router-dom";
import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);

const mockTicket = {
    "_id": "61445d147f4ae2d2b9565772",
    "title": "Ticket with Comments",
    "description": "This is ticket has comments",
    "author": "{__v: 0, _id: \"61444f25ec68780539442585\", createdAt…}",
    "comments": "[{…}, {…}]",
    "status": "Open",
    "deleted": null,
    "createdAt": "11/10/2021 16:17:52",
    "updatedAt": "11/10/2021 16:17:52",
    "__v": 0,
    "deletedAt": null
}

it("renders ticket without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Ticket ticket={mockTicket} />
        </Router>
    ), div);
})

it("renders ticket correctly", () => {
    const { getByText } = render((
        <Router>
            <Ticket ticket={mockTicket} />
        </Router>
    ));
    expect(getByText("Title: Ticket with Comments")).toBeInTheDocument();
    expect(getByText("Description: This is ticket has comments")).toBeInTheDocument();
    expect(getByText("Opened At: 11/10/2021 16:17:52")).toBeInTheDocument();
    expect(getByText("Last Updated: 11/10/2021 16:17:52")).toBeInTheDocument();
})