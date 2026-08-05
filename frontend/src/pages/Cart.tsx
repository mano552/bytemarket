import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Order } from "../types";
import List from "../components/List";

const Cart: React.FC = () => {
  const { items, loading, refreshCart, removeFromCart, checkout } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const total: number = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function handleCheckout(): Promise<void> {
    const order: Order | null = await checkout();
    setMessage(order ? `Order placed! Total: $${order.total.toFixed(2)}` : "Checkout failed.");
  }

  if (loading) return <p className="empty-state">Loading cart...</p>;

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">Cart</p>
        <h1>Your basket</h1>
      </div>

      {message && <div className="banner banner--success">{message}</div>}

      <List
        items={items}
        keyExtractor={(item) => item.id}
        emptyMessage="Your cart is empty. Go add something you like."
        renderItem={(item) => (
          <div className="cart-item">
            <div className="cart-item__info">
              <strong>{item.product.name}</strong>
              <span className="muted">
                ${item.product.price.toFixed(2)} × {item.quantity}
              </span>
            </div>
            <div className="cart-item__actions">
              <span className="price">${(item.product.price * item.quantity).toFixed(2)}</span>
              <button className="btn btn--ghost" onClick={() => removeFromCart(item.productId)}>
                Remove
              </button>
            </div>
          </div>
        )}
      />

      {items.length > 0 && (
        <div className="summary-card">
          <div className="summary-card__row">
            <span>Total</span>
            <span className="price price--lg">${total.toFixed(2)}</span>
          </div>
          <button className="btn btn--primary btn--block" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
