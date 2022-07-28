import React from "react";
import { Link } from "react-router-dom";
import error from '../../images/error.png';
import '../../App.css';
import './404.css';

class Error404 extends React.Component {
  render() {
    return (
      <div className="absolute-center d-flex align-items-center flex-column justify-space-between text-align-center">
        <img alt="error-img" src={error} />
        <h1>Oops.</h1>
        <h2>It looks like this page has gone missing</h2>
        <Link to="/"><button>Go Home</button></Link>
      </div>
    );
  }
}

export default Error404;