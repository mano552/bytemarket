import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { Role } from "./types";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/AdminProducts";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

const Nav: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { items, refreshCart } = useCart();

  useEffect(() => {
    if (token) refreshCart();
  }, [token, refreshCart]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">◆</span>bytemarket
        </Link>
        <nav className="nav-links">
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Orders</Link>
          {user?.role === Role.Admin && <Link to="/admin/products">Admin</Link>}
        </nav>
        <div className="nav-account">
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="nav-account__greeting">{user.name}</span>
              <button className="btn btn--ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn--primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Nav />
          <main className="page">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
