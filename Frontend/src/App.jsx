import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CinematicIntro from "./component/CinematicIntro";
import Signup from "./component/signup";
import Login from "./component/login";
import About from "./component/About";
import RefreshHandler from "./component/RefreshHandler";
import Dashboard from "./component/dashboard";
import BillGenerator from "./component/billgenerator";
import InventoryManager from "./component/inventorymanager";
import HomePage from "./component/HomePage";
import NotFoundPage from './component/NotFoundPage'; 
import Profile from "./component/profile";
import ShowBill from "./component/ShowBill";
import StockAnalysis from "./component/StockAnalysis";
import ProductList from "./component/ProductList";
import CustomerAccount from "./component/CustomerAccount";
import CustomerHistory from "./component/CustomerHistory";
import SupplierData from "./component/SupplierData";
import Navbar from "./component/navbar";
import Footer from "./component/footer"; // Import the Footer component
import Notes from "./component/Notes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // PrivateRoute to protect routes that need authentication
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cinematic Intro — plays once before anything else renders */}
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}
      {/* RefreshHandler will check authentication on page reload */}
      <RefreshHandler setisAutheticate={setIsAuthenticated} />
      
      {/* Navbar with authentication props */}
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      
      {/* Main content area */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes — no wrapper */}
          <Route path="/" element={<HomePage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setisAutheticate={setIsAuthenticated} />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Protected Routes — wrapped in app-page for dark bg + proper spacing */}
          <Route path="/home" element={<PrivateRoute element={<div className="app-page"><Dashboard /></div>} />} />
          <Route path="/about" element={<PrivateRoute element={<div className="app-page"><About /></div>} />} />
          <Route path="/profile" element={<PrivateRoute element={<div className="app-page"><Profile /></div>} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<div className="app-page"><Dashboard /></div>} />} />
          <Route path="/billgenerator" element={<PrivateRoute element={<div className="app-page"><BillGenerator /></div>} />} />
          <Route path="/showbills" element={<PrivateRoute element={<div className="app-page"><ShowBill /></div>} />} />
          <Route path="/stockanalysis" element={<PrivateRoute element={<div className="app-page"><StockAnalysis /></div>} />} />
          <Route path="/productlist" element={<PrivateRoute element={<div className="app-page"><ProductList /></div>} />} />
          <Route path="/inventorymanager" element={<PrivateRoute element={<div className="app-page"><InventoryManager /></div>} />} />
          <Route path="/customeraccount" element={<PrivateRoute element={<div className="app-page"><CustomerAccount /></div>} />} />
          <Route path="/customer/:customerId" element={<PrivateRoute element={<div className="app-page"><CustomerHistory /></div>} />} />
          <Route path="/supplierData" element={<PrivateRoute element={<div className="app-page"><SupplierData /></div>} />} />
          <Route path="/notes" element={<PrivateRoute element={<div className="app-page"><Notes /></div>} />} />
        </Routes>
      </main>
    </div>
  );
}
 
export default App;


