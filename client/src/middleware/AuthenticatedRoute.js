import React from "react";
import { Redirect, Route } from "react-router-dom";

function AuthenticatedRoute({ component: Component, ...restOfProps }) {
    let isAuthenticated = null;
    if (localStorage.getItem("authenticated") === true || localStorage.getItem("authenticated") === 'true') isAuthenticated = true;
    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
}

export default AuthenticatedRoute;