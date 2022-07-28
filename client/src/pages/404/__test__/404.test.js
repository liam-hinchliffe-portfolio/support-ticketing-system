import React from 'react';
import ReactDOM from 'react-dom';
import Error404 from '../404';
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);
it("renders 404 page without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Error404 />
        </Router>
    ), div);
})