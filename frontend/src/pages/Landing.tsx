import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product, PaginatedResponse, Category } from "../types";
import { apiRequest } from "../api/client";
import ProductCard from "../components/ProductCard";

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: "🎧",
  Books: "📚",
  Fashion: "👟",
  "Home & Kitchen": "🏠",
  "Sports & Outdoors": "🏋️",
};

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
  Books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
  "Home & Kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
  "Sports & Outdoors": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
};

const Landing: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      apiRequest<Category[]>("/categories"),
      apiRequest<PaginatedResponse<Product>>("/products?page=1&pageSize=8"),
    ]).then(([catRes, prodRes]) => {
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (prodRes.success && prodRes.data) setFeatured(prodRes.data.items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="landing">
      {/* Hero with animated background */}
      <section className="hero">
        <div className="hero__animated-bg">
          <div className="hero__gradient-orb hero__gradient-orb--1"></div>
          <div className="hero__gradient-orb hero__gradient-orb--2"></div>
          <div className="hero__gradient-orb hero__gradient-orb--3"></div>
          <div className="hero__particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="hero__particle" style={{ '--delay': `${i * 0.5}s`, '--x': `${Math.random() * 100}%`, '--duration': `${3 + Math.random() * 4}s` } as React.CSSProperties}></div>
            ))}
          </div>
        </div>
        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__badge-tag">🔥 Summer Sale — Up to 50% Off</span>
            <h1>Shop Smarter.<br />Live Better.</h1>
            <p className="hero__sub">
              Discover millions of products from top brands at unbeatable prices.
              Free shipping on orders over $50.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop Now
              </Link>
              <Link to="/shop" className="btn btn--ghost-dark btn--lg">
                Today's Deals
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>50K+</strong>
                <span>Products</span>
              </div>
              <div className="hero__stat">
                <strong>10K+</strong>
                <span>Happy Customers</span>
              </div>
              <div className="hero__stat">
                <strong>99%</strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__floating-cards">
              <div className="hero__float-card hero__float-card--1">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Headphones" />
                <span className="hero__float-price">$89.99</span>
              </div>
              <div className="hero__float-card hero__float-card--2">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" alt="Shoes" />
                <span className="hero__float-price">$79.99</span>
              </div>
              <div className="hero__float-card hero__float-card--3">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" alt="Watch" />
                <span className="hero__float-price">$129.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-bar">
        <div className="trust-bar__item">
          <span className="trust-bar__icon">🚚</span>
          <div>
            <strong>Free Shipping</strong>
            <span>On orders over $50</span>
          </div>
        </div>
        <div className="trust-bar__item">
          <span className="trust-bar__icon">🔒</span>
          <div>
            <strong>Secure Payment</strong>
            <span>256-bit SSL encryption</span>
          </div>
        </div>
        <div className="trust-bar__item">
          <span className="trust-bar__icon">↩️</span>
          <div>
            <strong>Easy Returns</strong>
            <span>30-day return policy</span>
          </div>
        </div>
        <div className="trust-bar__item">
          <span className="trust-bar__icon">💬</span>
          <div>
            <strong>24/7 Support</strong>
            <span>Always here to help</span>
          </div>
        </div>
      </section>

      {/* Category showcase */}
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Browse</p>
            <h2>Shop by Category</h2>
          </div>
          <Link to="/shop" className="section__link">View All →</Link>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="category-card">
              <div className="category-card__img">
                {CATEGORY_IMAGES[c.name] && (
                  <img src={CATEGORY_IMAGES[c.name]} alt={c.name} loading="lazy" />
                )}
              </div>
              <span className="category-card__icon">{CATEGORY_ICONS[c.name] ?? "🛍️"}</span>
              <span className="category-card__name">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals banner */}
      <section className="deals-banner">
        <div className="deals-banner__content">
          <span className="deals-banner__tag">Limited Time</span>
          <h2>Flash Deals of the Day</h2>
          <p>Get up to 40% off on electronics, fashion, and more. Don't miss out!</p>
          <Link to="/shop" className="btn btn--primary btn--lg">Shop Deals</Link>
        </div>
        <div className="deals-banner__visual">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=300&fit=crop" alt="Shopping deals" loading="lazy" />
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Trending</p>
            <h2>Popular Right Now</h2>
          </div>
          <Link to="/shop" className="section__link">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card__img"></div>
                <div className="skeleton-card__body">
                  <div className="skeleton-line skeleton-line--title"></div>
                  <div className="skeleton-line skeleton-line--text"></div>
                  <div className="skeleton-line skeleton-line--price"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Stay in the Loop</h2>
        <p>Subscribe to get exclusive deals, new arrivals, and insider-only discounts.</p>
        <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email address" className="newsletter__input" />
          <button type="submit" className="btn btn--primary btn--lg">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default Landing;
