import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from '../dashboard';
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);
it("renders dashboard page without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Dashboard />
        </Router>
    ), div);
})