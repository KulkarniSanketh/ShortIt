import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRecentUrls, shortenUrl } from "../services/api";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copyTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetchRecentUrls()
      .then((payload) => {
        if (!cancelled) {
          setRecent(payload.data || []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecent([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [result]);

  useEffect(
    () => () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    },
    []
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCopied(false);
    setResult(null);

    try {
      setLoading(true);
      const payload = await shortenUrl({
        url: originalUrl,
        customAlias,
      });
      setResult(payload.data);
      setOriginalUrl("");
      setCustomAlias("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!result?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the link. Select it and copy manually.");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="eyebrow">Fast. Memorable. Trackable.</p>
              <h1>Turn long links into something people actually want to click.</h1>
              <p className="lead">
                ShortIt compresses messy URLs, lets you pick a custom alias, and
                keeps a click history you can inspect any time.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/features" className="btn btn-outline-light">
                  See features
                </Link>
                <Link to="/analytics" className="btn btn-ghost">
                  Check analytics
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <form className="shorten-card" onSubmit={onSubmit}>
                <h2>Paste a URL</h2>
                <p className="text-muted">No account required. HTTPS destinations only.</p>
                <label className="form-label" htmlFor="originalUrl">
                  Destination
                </label>
                <input
                  id="originalUrl"
                  className="form-control form-control-lg"
                  type="url"
                  required
                  placeholder="https://example.com/very/long/path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
                <label className="form-label mt-3" htmlFor="customAlias">
                  Custom alias <span className="text-muted">(optional)</span>
                </label>
                <input
                  id="customAlias"
                  className="form-control"
                  type="text"
                  maxLength={32}
                  placeholder="launch-day"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                />
                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}
                <button className="btn btn-accent w-100 mt-4" type="submit" disabled={loading}>
                  {loading ? "Shortening..." : "Create short link"}
                </button>
                {result && (
                  <div className="result-box mt-4">
                    <p className="small text-muted mb-1">Your short URL</p>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                      {result.shortUrl}
                    </a>
                    <div className="d-flex gap-2 mt-3">
                      <button type="button" className="btn btn-dark btn-sm" onClick={copyLink}>
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <a
                        className="btn btn-outline-dark btn-sm"
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                      <Link className="btn btn-outline-dark btn-sm" to={`/analytics?id=${result.shortId}`}>
                        Analytics
                      </Link>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Recent public links</h2>
            <p>The latest shortened URLs stored in this environment.</p>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted">No links yet. Create the first one above.</p>
          ) : (
            <div className="table-responsive card-surface p-0">
              <table className="table table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Short link</th>
                    <th>Destination</th>
                    <th>Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <a href={item.shortUrl} target="_blank" rel="noopener noreferrer">
                          {item.shortId}
                        </a>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 360 }}>
                        {item.redirectUrl}
                      </td>
                      <td>{item.visitCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
