import React from "react";
import { Redirect, Route } from "react-router-dom";

function AdminRoute({ component: Component, ...restOfProps }) {
    let isAuthenticated = null;
    if ((localStorage.getItem("authenticated") === true || localStorage.getItem("authenticated") === 'true') && localStorage.getItem('type') === 'Admin') isAuthenticated = true;
    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/dashboard" />
            }
        />
    );
}

export default AdminRoute;