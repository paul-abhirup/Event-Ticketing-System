// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketPlace';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/marketplace" element={
          <Layout>
            <MarketplacePage />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;