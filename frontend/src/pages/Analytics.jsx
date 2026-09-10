import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAnalytics } from "../services/api";
import { extractShortId, formatDate } from "../utils/format";

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("id") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(
    async (value) => {
      const shortId = extractShortId(value);
      if (!shortId) {
        setError("Enter a short id or a ShortIt URL.");
        return;
      }

      setLoading(true);
      setError("");
      setData(null);

      try {
        const payload = await fetchAnalytics(shortId);
        setData(payload.data);
        setSearchParams({ id: shortId });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [setSearchParams]
  );

  useEffect(() => {
    const initial = searchParams.get("id");
    if (initial) {
      lookup(initial);
    }
    // Only run on first mount for deep links from the home page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visits = data?.visits || [];

  return (
    <section className="section">
      <div className="container page-narrow">
        <div className="section-heading">
          <h1>Link analytics</h1>
          <p>Look up any ShortIt alias to see click counts and recent visits.</p>
        </div>
        <form
          className="card-surface mb-4"
          onSubmit={(event) => {
            event.preventDefault();
            lookup(query);
          }}
        >
          <label className="form-label" htmlFor="lookup">
            Short id or full short URL
          </label>
          <div className="input-group">
            <input
              id="lookup"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="launch-day or http://localhost:8000/launch-day"
            />
            <button className="btn btn-accent" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Look up"}
            </button>
          </div>
        </form>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {data && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <span>Total clicks</span>
                  <strong>{data.visitCount}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <span>Created</span>
                  <strong>{formatDate(data.createdAt)}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <span>Alias</span>
                  <strong>{data.shortId}</strong>
                </div>
              </div>
            </div>
            <div className="card-surface">
              <h2 className="h5">Destination</h2>
              <a href={data.redirectUrl} target="_blank" rel="noopener noreferrer">
                {data.redirectUrl}
              </a>
              <h2 className="h5 mt-4">Recent visits</h2>
              {visits.length === 0 ? (
                <p className="text-muted mb-0">No clicks recorded yet.</p>
              ) : (
                <ul className="list-unstyled mb-0 visit-list">
                  {visits.map((visit, index) => (
                    <li key={`${visit.timestamp}-${index}`}>
                      <span>{formatDate(visit.timestamp)}</span>
                      <small>{visit.userAgent || "Unknown client"}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
