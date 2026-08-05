import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product, PaginatedResponse, Category } from "../types";
import { apiRequest } from "../api/client";
import List from "../components/List";
import ProductCard from "../components/ProductCard";

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") ?? "");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories once for the filter dropdown
  useEffect(() => {
    apiRequest<Category[]>("/categories").then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  const fetchProducts = useCallback((): void => {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", pageSize: "40" });
    if (search) params.set("search", search);
    if (selectedCategory) params.set("categoryId", selectedCategory);

    apiRequest<PaginatedResponse<Product>>(`/products?${params.toString()}`)
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.items);
        } else {
          setError(res.message ?? "Failed to load products");
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [search, selectedCategory]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">Catalog</p>
        <h1>Shop the collection</h1>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-bar__search"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSearchParams(e.target.value ? { category: e.target.value } : {});
          }}
          className="filter-bar__select"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="banner banner--error">{error}</div>}
      {loading ? (
        <p className="empty-state">Loading products...</p>
      ) : (
        <List<Product>
          items={products}
          keyExtractor={(p) => p.id}
          renderItem={(p) => <ProductCard product={p} />}
          emptyMessage="No products match your search."
          className="product-grid"
        />
      )}
    </div>
  );
};

export default Products;
