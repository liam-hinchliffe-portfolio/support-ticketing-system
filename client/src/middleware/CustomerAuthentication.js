import React from "react";
import { Redirect, Route } from "react-router-dom";

function CustomerRoute({ component: Component, ...restOfProps }) {
    let isAuthenticated = null;
    if (localStorage.getItem("authenticated") && localStorage.getItem("type") === "Customer") isAuthenticated = true;
    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/dashboard" />
            }
        />
    );
}

export default CustomerRoute;