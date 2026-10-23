import { useState } from "react";
import { API_KEY } from "../api";
import { Card } from "../components/UI";

const presets = [
  { label: "GET all users", method: "GET", path: "/users", body: "" },
  { label: "GET user by id", method: "GET", path: "/users/1", body: "" },
  { label: "GET search users", method: "GET", path: "/users?search=riya", body: "" },
  { label: "POST invalid user (400)", method: "POST", path: "/users", body: "{}" },
  { label: "GET products (needs key)", method: "GET", path: "/products", body: "" },
  { label: "GET unknown route (404)", method: "GET", path: "/does-not-exist", body: "" },
];

export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/users");
  const [body, setBody] = useState("");
  const [sendKey, setSendKey] = useState(true);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const usePreset = (p) => { setMethod(p.method); setPath(p.path); setBody(p.body); };

  const send = async () => {
    setBusy(true);
    const start = performance.now();
    try {
      const res = await fetch(`/api${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...(sendKey ? { "x-api-key": API_KEY } : {}) },
        body: method === "GET" || method === "DELETE" ? undefined : body || undefined,
      });
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON */ }
      setResult({ status: res.status, ok: res.ok, ms: Math.round(performance.now() - start), body: pretty });
    } catch (e) {
      setResult({ status: 0, ok: false, ms: Math.round(performance.now() - start), body: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1>API Tester</h1>
      <Card title="Build a request" hint="a tiny Postman, right inside the app">
        <div className="chips">
          {presets.map((p) => (
            <button key={p.label} className="chip" onClick={() => usePreset(p)}>{p.label}</button>
          ))}
        </div>

        <div className="row">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {["GET", "POST", "PUT", "DELETE"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input className="grow" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/users" />
          <button onClick={send} disabled={busy}>{busy ? "Sending…" : "Send"}</button>
        </div>

        <label className="check">
          <input type="checkbox" checked={sendKey} onChange={(e) => setSendKey(e.target.checked)} />
          Send <code>x-api-key</code> header (untick it, then call <code>/products</code> to see the 401 from auth middleware)
        </label>

        {(method === "POST" || method === "PUT") && (
          <textarea rows={5} placeholder='{"name": "Test", "email": "t@x.com"}' value={body} onChange={(e) => setBody(e.target.value)} />
        )}
      </Card>

      {result && (
        <Card title="Response">
          <p>
            <span className={`badge ${result.ok ? "ok" : "bad"}`}>{result.status || "ERR"}</span>
            <span className="muted"> {result.ms} ms</span>
          </p>
          <pre>{result.body}</pre>
        </Card>
      )}
    </>
  );
}
