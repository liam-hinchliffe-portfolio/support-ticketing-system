import React from 'react';
import ReactDOM from 'react-dom';
import Comment from '../comment';
import { BrowserRouter as Router } from "react-router-dom";
import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);

const mockComment = {
    "_id": "61545d0c35a77ec229f11f02",
    "content": "Hi, how can we help you?",
    "author": "61444dbbca7c1282d172af2c",
    "ticket": "61445d147f4ae2d2b9565772",
    "deleted": null,
    "createdAt": "11/10/2021 16:17:52",
    "updatedAt": "2021-10-11T15:17:52.239Z",
    "__v": 0,
    "deletedAt": null
}

it("renders comment without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Comment comment={mockComment} />
        </Router>
    ), div);
})

it("renders comment correctly", () => {
    const { getByText } = render((
        <Router>
            <Comment comment={mockComment} />
        </Router>
    ));
    expect(getByText("Content: Hi, how can we help you?")).toBeInTheDocument();
    expect(getByText("Created: 11/10/2021 16:17:52")).toBeInTheDocument();
})