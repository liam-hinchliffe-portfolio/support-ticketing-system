import React from "react";
import { Redirect, Route } from "react-router-dom";

function UnauthenticatedRoute({ component: Component, ...restOfProps }) {
    let allowNext = null;
    console.log("authenticated", localStorage.getItem("authenticated"));
    allowNext = localStorage.getItem("authenticated") == 'true' ? false : true;
    return (
        <Route
            {...restOfProps}
            render={(props) =>
                allowNext ? <Component {...props} /> : <Redirect to="/dashboard" />
            }
        />
    );
}

export default UnauthenticatedRoute;