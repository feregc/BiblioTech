import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Cart from "./components/cart/Cart";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Profile from "./pages/Profile";
import BookDetails from "./pages/BookDetails";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationContainer from "./components/common/NotificationContainer"; // 👈 Agregar este import

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <Cart />
            <main className="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <NotificationContainer /> {/* 👈 Agregar esta línea */}
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;