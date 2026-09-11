import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAliasSuggestions, shortenUrl } from "../services/api";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [aliasSuggestions, setAliasSuggestions] = useState([]);
  const copyTimer = useRef(null);

  const refreshAliasSuggestions = async (alias, offset = 0) => {
    const trimmedAlias = alias.trim();
    if (!trimmedAlias) {
      setAliasSuggestions([]);
      return;
    }

    try {
      const payload = await fetchAliasSuggestions(trimmedAlias, offset);
      setAliasSuggestions(payload.data?.suggestions || []);
    } catch {
      setAliasSuggestions([]);
    }
  };

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
    setAliasSuggestions([]);

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
      if (customAlias) {
        const suggestions = err.payload?.suggestions || [];
        setAliasSuggestions(suggestions);
        if (!suggestions.length) {
          await refreshAliasSuggestions(customAlias, 0);
        }
      }
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
                {aliasSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="small text-muted mb-2">Available alternatives</p>
                    <div className="d-flex flex-wrap gap-2">
                      {aliasSuggestions.map((suggestedAlias) => (
                        <button
                          key={suggestedAlias}
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => setCustomAlias(suggestedAlias)}
                        >
                          {suggestedAlias}
                        </button>
                      ))}
                    </div>
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
    </>
  );
}
