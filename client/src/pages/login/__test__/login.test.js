import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../login';
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);
it("renders login page without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Login />
        </Router>
    ), div);
})