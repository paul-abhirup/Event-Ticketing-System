import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConnectWallet from "./components/ConnectWallet";
import MintTicket from "./components/MintTicket";
// import ListTicket from "./components/ListTicket";
// import PlaceBid from "./components/PlaceBid";
// import PurchaseTicket from "./components/PurchaseTicket";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/mint-ticket" element={<MintTicket />} />
        {/* <Route path="/list-ticket" element={<ListTicket />} />
        <Route path="/place-bid" element={<PlaceBid />} />
        <Route path="/purchase-ticket" element={<PurchaseTicket />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
