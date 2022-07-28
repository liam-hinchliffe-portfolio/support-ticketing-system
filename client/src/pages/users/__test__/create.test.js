import React from 'react';
import ReactDOM from 'react-dom';
import CreateUser from '../create';
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);
it("renders create user page without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <CreateUser />
        </Router>
    ), div);
})