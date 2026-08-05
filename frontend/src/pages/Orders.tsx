import React, { useEffect, useState } from "react";
import type { Order } from "../types";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import List from "../components/List";

const Orders: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiRequest<Order[]>("/orders", { token }).then((res) => {
      if (res.success && res.data) setOrders(res.data);
      setLoading(false);
    });
  }, [token]);

  if (!token) return <p className="empty-state">Please log in to view your orders.</p>;
  if (loading) return <p className="empty-state">Loading orders...</p>;

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">History</p>
        <h1>Your orders</h1>
      </div>
      <List<Order>
        items={orders}
        keyExtractor={(o) => o.id}
        emptyMessage="You haven't placed any orders yet."
        renderItem={(order) => (
          <div className="order">
            <div className="order__top">
              <strong>Order #{order.id.slice(0, 8)}</strong>
              <span className={`badge badge--status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="order__bottom">
              <span className="muted">{new Date(order.createdAt).toLocaleString()}</span>
              <span className="price">${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Orders;
