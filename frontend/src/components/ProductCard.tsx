import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [imageFailed, setImageFailed] = useState(false);

  const handleAdd = (): void => {
    if (!token) {
      alert("Please log in first");
      return;
    }
    addToCart(product.id, 1);
  };

  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__media">
        {product.imageUrl && !imageFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{product.name.charAt(0)}</span>
        )}
      </Link>
      <div className="product-card__body">
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__meta">
          <span className="price">${product.price.toFixed(2)}</span>
          {product.stock === 0 ? (
            <span className="badge badge--out">Out of stock</span>
          ) : lowStock ? (
            <span className="badge badge--low">Only {product.stock} left</span>
          ) : (
            <span className="badge badge--ok">In stock</span>
          )}
        </div>

        <button
          className="btn btn--primary btn--block"
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
