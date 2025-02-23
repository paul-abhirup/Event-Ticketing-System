import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/connect-wallet">Connect Wallet</Link>
      <Link to="/mint-ticket">Mint Ticket</Link>
      <Link to="/list-ticket">List Ticket</Link>
      <Link to="/place-bid">Place Bid</Link>
      <Link to="/purchase-ticket">Purchase Ticket</Link>
    </nav>
  );
};

export default Navbar;
