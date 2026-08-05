import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    apiRequest<Product>(`/products/${id}`).then((res) => {
      if (res.success && res.data) setProduct(res.data);
      setImageFailed(false);
      setLoading(false);
    });
  }, [id]);

  async function handleAdd(): Promise<void> {
    if (!token) {
      alert("Please log in first");
      return;
    }
    if (!product) return;
    await addToCart(product.id, quantity);
    setAdded(true);
  }

  if (loading) return <p className="empty-state">Loading product...</p>;
  if (!product) return <p className="empty-state">Product not found.</p>;

  return (
    <div>
      <Link to="/shop" className="back-link">
        ← Back to shop
      </Link>

      <div className="product-detail">
        <div className="product-detail__media">
          {product.imageUrl && !imageFailed ? (
            <img src={product.imageUrl} alt={product.name} onError={() => setImageFailed(true)} />
          ) : (
            <span aria-hidden="true">{product.name.charAt(0)}</span>
          )}
        </div>

        <div className="product-detail__info">
          <h1>{product.name}</h1>
          <p className="price price--lg">${product.price.toFixed(2)}</p>
          <p className="product-detail__desc">{product.description}</p>

          {product.stock === 0 ? (
            <span className="badge badge--out">Out of stock</span>
          ) : (
            <span className="badge badge--ok">{product.stock} in stock</span>
          )}

          {added && <div className="banner banner--success">Added to cart!</div>}

          <div className="product-detail__actions">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="qty-input"
              disabled={product.stock === 0}
            />
            <button
              className="btn btn--primary"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Unavailable" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
