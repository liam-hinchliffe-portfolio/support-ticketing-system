import React from "react";
import Header from "../../components/header/header";
import TicketPreview from "../../components/ticket/ticket";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tickets: [] };
    this.newTicketRedirect = this.newTicketRedirect.bind(this);
  }

  componentDidMount() {
    fetch("/tickets")
      .then(res => res.text())
      .then(res => this.setState({ tickets: JSON.parse(res) }))
  }

  newTicketRedirect() {
    window.location.href = "/tickets/create";
  }

  render() {
    return (
      <div>
        <Header />
        <h2>Tickets</h2>
        {localStorage.getItem("type") === "Customer" ? <button onClick={this.newTicketRedirect}>New Ticket</button> : null}
        {
          this.state.tickets.length ?
            this.state.tickets.map(ticket => (
              <TicketPreview key={ticket._id} ticket={ticket} />
            ))
            :
            "No tickets for this account"
        }
      </div>
    );
  }
}

export default Dashboard;