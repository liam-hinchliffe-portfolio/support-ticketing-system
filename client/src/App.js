import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Dashboard from './pages/dashboard/dashboard';
import Error404 from './pages/404/404';
import Login from './pages/login/login';
import Register from './pages/register/register';
import AuthenticatedRoute from './middleware/AuthenticatedRoute';
import CustomerRoute from './middleware/CustomerAuthentication';
import CreateTicket from './pages/ticket/create';
import ViewTicket from './pages/ticket/view';
import AdminRoute from './middleware/AdminRoute';
import ViewUsers from './pages/users/view';
import CreateUser from './pages/users/create';
import UnauthenticatedRoute from './middleware/UnauthenticatedRoute';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <UnauthenticatedRoute exact path="/login" component={Login} />
          <UnauthenticatedRoute exact path="/register" component={Register} />
          <AuthenticatedRoute exact path="/" component={Dashboard} />
          <AuthenticatedRoute exact path="/dashboard" component={Dashboard} />
          <CustomerRoute exact path="/tickets/create" component={CreateTicket} />
          <AuthenticatedRoute exact path="/tickets/:id/view" component={ViewTicket} />
          <AdminRoute exact path="/users" component={ViewUsers} />
          <AdminRoute exact path="/users/create" component={CreateUser} />
          <Route component={Error404} />
        </Switch>
      </Router>
    );
  }
}

export default App;