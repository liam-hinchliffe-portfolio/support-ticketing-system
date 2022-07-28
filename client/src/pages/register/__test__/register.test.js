import React from 'react';
import ReactDOM from 'react-dom';
import Register from '../register';
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);
it("renders register page without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Register />
        </Router>
    ), div);
})