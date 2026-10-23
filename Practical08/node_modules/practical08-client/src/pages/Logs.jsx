import { useEffect, useState } from "react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, ErrorBox, Loader } from "../components/UI";

export default function Logs() {
  const notify = useToast();
  const { data: logs, loading, error, reload } = useFetch(() => api.getLogs(), []);
  const [auto, setAuto] = useState(true);

  // auto-refresh every 2 seconds
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(reload, 2000);
    return () => clearInterval(t);
  }, [auto, reload]);

  const clear = async () => {
    await api.clearLogs();
    notify("Logs cleared");
    reload();
  };

  return (
    <>
      <h1>Request Logs</h1>
      <Card
        title="Captured by the logger middleware"
        hint="GET /api/logs"
        actions={
          <div className="row">
            <label className="check"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto-refresh</label>
            <button className="ghost" onClick={reload}>Refresh</button>
            <button className="danger" onClick={clear}>Clear</button>
          </div>
        }
      >
        {loading && !logs && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {logs && logs.length === 0 && <EmptyState text="No requests yet. Use the other pages, then come back." />}
        {logs && logs.length > 0 && (
          <table>
            <thead><tr><th>Time</th><th>Method</th><th>URL</th><th>Status</th><th>ms</th></tr></thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}>
                  <td>{new Date(l.time).toLocaleTimeString()}</td>
                  <td><span className={`method ${l.method}`}>{l.method}</span></td>
                  <td><code>{l.url}</code></td>
                  <td><span className={`badge ${l.status < 400 ? "ok" : "bad"}`}>{l.status}</span></td>
                  <td>{l.ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
