import React, { useCallback, useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import type {
  Category,
  CreateProductDTO,
  PaginatedResponse,
  Product,
  UpdateProductDTO,
} from "../types";
import { apiRequest, uploadImage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm: CreateProductDTO = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: "",
  imageUrl: "",
};

const AdminProducts: React.FC = () => {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductDTO>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const [productsRes, categoriesRes] = await Promise.all([
      apiRequest<PaginatedResponse<Product>>("/products?page=1&pageSize=100"),
      apiRequest<Category[]>("/categories"),
    ]);

    if (productsRes.success && productsRes.data) {
      setProducts(productsRes.data.items);
    } else {
      setError(productsRes.message ?? "Failed to load products");
    }

    if (categoriesRes.success && categoriesRes.data) {
      setCategories(categoriesRes.data);
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  function clearImagePreview(): void {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  }

  function resetForm(): void {
    setEditingId(null);
    clearImagePreview();
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function startEdit(product: Product): void {
    setEditingId(product.id);
    clearImagePreview();
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? "",
    });
    setImagePreview(product.imageUrl ?? null);
    setMessage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleImageSelect(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError(null);
    setUploadingImage(true);

    const localPreview = URL.createObjectURL(file);
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(localPreview);

    const res = await uploadImage(file, token);
    setUploadingImage(false);

    if (!res.success || !res.data) {
      setError(res.message ?? "Failed to upload image");
      clearImagePreview();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setForm((prev) => ({ ...prev, imageUrl: res.data!.imageUrl }));
    setMessage("Image uploaded successfully.");
  }

  function handleRemoveImage(): void {
    clearImagePreview();
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!token) return;

    if (uploadingImage) {
      setError("Please wait for the image upload to finish.");
      return;
    }

    setError(null);
    setMessage(null);

    const payload: CreateProductDTO = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl?.trim() || undefined,
    };

    if (editingId) {
      const updatePayload: UpdateProductDTO = payload;
      const res = await apiRequest<Product>(`/products/${editingId}`, {
        method: "PATCH",
        token,
        body: updatePayload,
      });

      if (!res.success) {
        setError(res.message ?? "Failed to update product");
        return;
      }

      setMessage("Product updated successfully.");
    } else {
      const res = await apiRequest<Product>("/products", {
        method: "POST",
        token,
        body: payload,
      });

      if (!res.success) {
        setError(res.message ?? "Failed to create product");
        return;
      }

      setMessage("Product created successfully.");
    }

    resetForm();
    await fetchData();
  }

  async function handleDelete(productId: string, productName: string): Promise<void> {
    if (!token) return;
    if (!window.confirm(`Delete "${productName}"?`)) return;

    setError(null);
    setMessage(null);

    const res = await apiRequest<null>(`/products/${productId}`, {
      method: "DELETE",
      token,
    });

    if (!res.success) {
      setError(res.message ?? "Failed to delete product");
      return;
    }

    if (editingId === productId) resetForm();
    setMessage("Product deleted successfully.");
    await fetchData();
  }

  function getCategoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
  }

  if (loading) return <p className="empty-state">Loading admin panel...</p>;

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Product Management</h1>
        <p className="muted">Create, update, and delete products from the catalog.</p>
      </div>

      {error && <div className="banner banner--error">{error}</div>}
      {message && <div className="banner banner--success">{message}</div>}

      <div className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </label>

          <div className="admin-form__row">
            <label className="field">
              <span>Price ($)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
              />
            </label>

            <label className="field">
              <span>Stock</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Category</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>Product Image</span>
            <div className="image-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="image-upload__input"
                onChange={handleImageSelect}
              />
              {imagePreview ? (
                <div className="image-upload__preview">
                  <img src={imagePreview} alt="Product preview" />
                  {uploadingImage && <span className="image-upload__status">Uploading...</span>}
                </div>
              ) : (
                <div className="image-upload__placeholder">
                  <span>No image selected</span>
                </div>
              )}
              <div className="image-upload__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--block"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading..." : "Choose from Gallery"}
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    className="btn btn--danger btn--block"
                    onClick={handleRemoveImage}
                    disabled={uploadingImage}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary" disabled={uploadingImage}>
              {editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button type="button" className="btn btn--secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="admin-table-wrap">
          <h2>All Products ({products.length})</h2>
          <div className="admin-table">
            {products.length === 0 ? (
              <p className="empty-state">No products found.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="admin-row">
                  <div className="admin-row__media">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>{product.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="admin-row__info">
                    <strong>{product.name}</strong>
                    <span className="muted">{getCategoryName(product.categoryId)}</span>
                    <span className="muted">${product.price.toFixed(2)} · Stock: {product.stock}</span>
                  </div>
                  <div className="admin-row__actions">
                    <button className="btn btn--secondary btn--sm" onClick={() => startEdit(product)}>
                      Edit
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
