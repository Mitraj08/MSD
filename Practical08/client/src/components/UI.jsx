export function Loader({ text = "Loading..." }) {
  return <div className="loader"><span className="spinner" />{text}</div>;
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error">
      {message}
      {onRetry && <button className="link" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function EmptyState({ text }) {
  return <p className="empty">{text}</p>;
}

export function Card({ title, hint, children, actions }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>{title} {hint && <small>{hint}</small>}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
