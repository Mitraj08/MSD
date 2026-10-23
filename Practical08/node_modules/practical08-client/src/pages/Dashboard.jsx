import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Card, ErrorBox, Loader } from "../components/UI";

export default function Dashboard() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    Promise.all([api.health(), api.getUsers(), api.getProducts()])
      .then(([health, users, products]) => setState({ health, users, products }))
      .catch((e) => setState({ error: e.message }));
  }, []);

  if (state.loading) return <Loader />;
  if (state.error) return <ErrorBox message={`Cannot reach the server: ${state.error}. Is the backend running on port 5000?`} />;

  const { health, users, products } = state;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat"><b>{health.status}</b><span>Server status</span></div>
        <div className="stat"><b>{Math.round(health.uptime)}s</b><span>Uptime</span></div>
        <div className="stat"><b>{users.length}</b><span>Users</span></div>
        <div className="stat"><b>{products.length}</b><span>Products</span></div>
        <div className="stat"><b>₹{totalValue.toLocaleString("en-IN")}</b><span>Inventory value</span></div>
      </div>

      <Card title="What this practical demonstrates">
        <ul className="plain">
          <li><b>Routing</b> – <code>/api/users</code>, <code>/api/products</code>, <code>/api/logs</code> use <code>express.Router()</code>.</li>
          <li><b>Middleware</b> – <code>cors</code>, <code>express.json</code>, <code>logger</code>, <code>auth</code>, validators, error handler.</li>
          <li><b>Request handling</b> – params, query strings, JSON bodies, headers and status codes.</li>
        </ul>
        <p>Try it: <Link to="/users">manage users</Link>, <Link to="/tester">fire raw requests</Link>, or watch the middleware in <Link to="/logs">Request Logs</Link>.</p>
      </Card>
    </>
  );
}
