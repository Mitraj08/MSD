import { useMemo, useState } from "react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, ErrorBox, Loader } from "../components/UI";

export default function Products() {
  const notify = useToast();
  const { data: products, loading, error, reload } = useFetch(() => api.getProducts(), []);
  const [form, setForm] = useState({ name: "", price: "" });
  const [sort, setSort] = useState("id");

  const sorted = useMemo(() => {
    if (!products) return [];
    const copy = [...products];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    else if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [products, sort]);

  const total = useMemo(() => (products || []).reduce((s, p) => s + p.price, 0), [products]);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.addProduct(form);
      setForm({ name: "", price: "" });
      notify("Product added");
      reload();
    } catch (err) { notify(err.message, "error"); }
  };

  const remove = async (p) => {
    try {
      await api.deleteProduct(p.id);
      notify(`${p.name} deleted`);
      reload();
    } catch (err) { notify(err.message, "error"); }
  };

  return (
    <>
      <h1>Products</h1>

      <Card title="Add product" hint="POST /api/products — protected by auth middleware (x-api-key)">
        <form className="row" onSubmit={add}>
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <button type="submit">Add</button>
        </form>
      </Card>

      <Card
        title="Inventory"
        hint={`Total value ₹${total.toLocaleString("en-IN")}`}
        actions={
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="id">Sort: newest last</option>
            <option value="name">Sort: name</option>
            <option value="price-asc">Sort: price ↑</option>
            <option value="price-desc">Sort: price ↓</option>
          </select>
        }
      >
        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {!loading && !error && sorted.length === 0 && <EmptyState text="No products yet." />}
        <ul className="list">
          {sorted.map((p) => (
            <li key={p.id}>
              <div className="grow"><strong>{p.name}</strong></div>
              <span className="price">₹{p.price.toLocaleString("en-IN")}</span>
              <button className="danger" onClick={() => remove(p)}>Delete</button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
