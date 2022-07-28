import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../header';
import { BrowserRouter as Router } from "react-router-dom";
import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

afterEach(cleanup);

it("renders header without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render((
        <Router>
            <Header />
        </Router>
    ), div);
})

it("renders header correctly with nav bar", () => {
    const { getByTestId } = render((
        <Router>
            <Header navBar={true} />
        </Router>
    ));
    expect(getByTestId("header-navbar")).toBeInTheDocument();
})

it("renders header correctly without nav bar", () => {
    const { queryByTestId } = render((
        <Router>
            <Header navBar={false} />
        </Router>
    ))
    expect(queryByTestId("header-navbar")).not.toBeInTheDocument()
})