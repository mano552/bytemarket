import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&q=80",
  Books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop&q=80",
  "Home & Kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop&q=80",
  "Sports & Outdoors": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&q=80",
};

const HERO_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: `${i * 0.45}s`,
  x: `${(i * 17 + 11) % 100}%`,
  duration: `${3 + (i % 5)}s`,
}));

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");

  useEffect(() => {
    Promise.all([
      apiRequest<Category[]>("/categories"),
      apiRequest<PaginatedResponse<Product>>("/products?page=1&pageSize=8"),
    ])
      .then(([catRes, prodRes]) => {
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
        if (prodRes.success && prodRes.data) {
          setFeatured(prodRes.data.items);
        } else {
          setError(prodRes.message ?? "Unable to load featured products.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong while loading the store. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  const handleNewsletter = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("success");
    setNewsletterEmail("");
  };

  const heroProducts = featured.slice(0, 3);

  return (
    <div className="landing">
      {/* Hero — full-width */}
      <section className="hero" aria-label="Welcome">
        <div className="hero__animated-bg" aria-hidden="true">
          <div className="hero__gradient-orb hero__gradient-orb--1" />
          <div className="hero__gradient-orb hero__gradient-orb--2" />
          <div className="hero__gradient-orb hero__gradient-orb--3" />
          <div className="hero__particles">
            {HERO_PARTICLES.map((p) => (
              <div
                key={p.id}
                className="hero__particle"
                style={
                  {
                    "--delay": p.delay,
                    "--x": p.x,
                    "--duration": p.duration,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="landing-container hero__content">
          <div className="hero__text">
            <span className="hero__badge-tag">Summer Sale — Up to 50% Off</span>
            <h1>
              Shop Smarter.
              <br />
              Live Better.
            </h1>
            <p className="hero__sub">
              Discover curated products from top brands at unbeatable prices.
              Free shipping on orders over $50.
            </p>

            <form className="hero__search" onSubmit={handleSearch}>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, and categories..."
                aria-label="Search products"
              />
              <button type="submit" className="btn btn--primary">
                Search
              </button>
            </form>

            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop Now
              </Link>
              <Link to="/shop" className="btn btn--ghost-dark btn--lg">
                Today&apos;s Deals
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

          <div className="hero__visual" aria-hidden="true">
            {loading ? (
              <div className="hero__visual-skeleton">
                <div className="hero__skeleton-card hero__skeleton-card--1" />
                <div className="hero__skeleton-card hero__skeleton-card--2" />
                <div className="hero__skeleton-card hero__skeleton-card--3" />
              </div>
            ) : (
              <div className="hero__floating-cards">
                {heroProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={`hero__float-card hero__float-card--${index + 1}`}
                  >
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="hero__float-fallback">{product.name.charAt(0)}</div>
                    )}
                    <span className="hero__float-name">{product.name}</span>
                    <span className="hero__float-price">${product.price.toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-bar-wrap" aria-label="Store benefits">
        <div className="landing-container">
          <div className="trust-bar">
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
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" aria-labelledby="categories-heading">
        <div className="landing-container">
          <div className="section__header">
            <div>
              <p className="eyebrow">Browse</p>
              <h2 id="categories-heading">Shop by Category</h2>
            </div>
            <Link to="/shop" className="section__link">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="category-grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="category-card category-card--skeleton">
                  <div className="skeleton-block skeleton-block--img" />
                  <div className="skeleton-block skeleton-block--text" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
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
          ) : (
            <p className="empty-state">Categories will appear here once they are added.</p>
          )}
        </div>
      </section>

      {/* Deals banner */}
      <section className="deals-banner-wrap" aria-label="Flash deals">
        <div className="landing-container">
          <div className="deals-banner">
            <div className="deals-banner__content">
              <span className="deals-banner__tag">Limited Time</span>
              <h2>Flash Deals of the Day</h2>
              <p>
                Get up to 40% off on electronics, fashion, and more. Don&apos;t miss out on
                today&apos;s best prices.
              </p>
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop Deals
              </Link>
            </div>
            <div className="deals-banner__visual">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop&q=80"
                alt="Shopping deals and discounts"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section" aria-labelledby="featured-heading">
        <div className="landing-container">
          <div className="section__header">
            <div>
              <p className="eyebrow">Trending</p>
              <h2 id="featured-heading">Popular Right Now</h2>
            </div>
            <Link to="/shop" className="section__link">
              View All →
            </Link>
          </div>

          {error && <div className="banner banner--error">{error}</div>}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-card__img" />
                  <div className="skeleton-card__body">
                    <div className="skeleton-line skeleton-line--title" />
                    <div className="skeleton-line skeleton-line--text" />
                    <div className="skeleton-line skeleton-line--price" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <p>No products available yet.</p>
              <Link to="/shop" className="btn btn--primary">
                Browse the shop
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-wrap" aria-labelledby="newsletter-heading">
        <div className="landing-container">
          <div className="newsletter">
            <h2 id="newsletter-heading">Stay in the Loop</h2>
            <p>
              Subscribe to get exclusive deals, new arrivals, and insider-only discounts delivered
              to your inbox.
            </p>
            {newsletterStatus === "success" ? (
              <p className="newsletter__success">Thanks for subscribing! Check your inbox soon.</p>
            ) : (
              <form className="newsletter__form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter__input"
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="btn btn--primary btn--lg">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
