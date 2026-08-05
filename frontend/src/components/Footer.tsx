import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-col">
          <p className="brand brand--footer">
            <span className="brand__mark">◆</span>bytemarket
          </p>
          <p className="footer-tagline">
            Your one-stop destination for electronics, books, fashion, home essentials, and more — delivered fast with care.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?category=electronics">Electronics</Link>
          <Link to="/shop?category=fashion">Fashion</Link>
          <Link to="/shop?category=books">Books</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Log In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">Order History</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} bytemarket. All rights reserved.</span>
        <span>Built with TypeScript &bull; React &bull; Express &bull; PostgreSQL</span>
      </div>
    </footer>
  );
};

export default Footer;
