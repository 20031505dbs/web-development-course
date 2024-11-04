import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import FeaturedProducts from "./Components/FeaturedProducts";

import NewArrivals from "./Components/NewArrivals";
import Login from "./Components/Login";
import Register from "./Components/Register";
import CartProduct from "./Components/CartProduct";
import "./App.css";
import { AuthProvider } from "./Components/AuthContext";
import AllProducts from "./Components/Allproduct";
import { useEffect, useState } from "react";
import ProductsByCategory from "./Components/ProductsByCategory";
import Offers from "./Components/Offers";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(JSON.parse(localStorage.getItem("isAuthenticated")));
  }, []);
  console.log(window.location.pathname);
  return (
    <AuthProvider>
      {isAuthenticated && window.location.pathname != "/" && <Header />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllProducts />} />
          <Route path="/cart" element={<CartProduct />} />
          <Route path="/featured" element={<FeaturedProducts />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/offers" element={<Offers />} />
          <Route
            path="/categories/:category"
            element={<ProductsByCategory />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>

      {isAuthenticated && window.location.pathname != "/" && <Footer />}
    </AuthProvider>
  );
}

export default App;
