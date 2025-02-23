import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConnectWallet from "./components/ConnectWallet";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/connect-wallet" element={<ConnectWallet />} />
      </Routes>
    </Router>
  );
};

export default App;
