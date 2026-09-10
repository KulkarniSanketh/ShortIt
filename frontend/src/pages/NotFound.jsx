import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section text-center">
      <div className="container">
        <h1>Page not found</h1>
        <p className="text-muted">That route does not exist in ShortIt.</p>
        <Link to="/" className="btn btn-accent">
          Back home
        </Link>
      </div>
    </section>
  );
}
