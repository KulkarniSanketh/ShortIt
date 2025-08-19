import { useState } from "react";
import "./app.css";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const shorten = async () => {
    if (!originalUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      setShortUrl("");

      // Post to backend
      const res = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await res.json();
      setShortUrl(data.shortUrl); // assuming backend returns { shortUrl: "..." }
    } catch (err) {
      console.error(err);
      alert("Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  const redirectToWebsite = () => {
    window.location.href = shortUrl;
  };

  const copyText = () => {
    if (!shortUrl) return;

    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        alert("Copied: " + shortUrl);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div id="home" className="container">
      <div id="header">
        <h1 id="heading">Short-It</h1>
        <br />
        <h4>
          Turn long, messy URLs into short, shareable links in seconds. Simple,
          fast, and free.
        </h4>
      </div>

      <div className="Main">
        <h2>Paste the URL to be Shortened</h2>
        <br />
        <div id="inputData">
          <input
            type="text"
            placeholder="Enter the link here"
            id="inputUrl"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={shorten}
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>
        <br />
        <h5>
          URL shortener allows you to create a shortened link making it easy to
          share
        </h5>

        {shortUrl && (
          <div>
            <p>Shortened URL:</p>
            <div className="shortnedUrlOut">
              <p rel="noopener noreferrer" id="myLink">
                {shortUrl}
              </p>
              <br />
              <br />
              <button
                type="button"
                className="btn btn-success"
                id="redirectToWebsite"
                onClick={redirectToWebsite}
              >
                Go to the website
              </button>

              <button
                type="button"
                className="btn btn-primary ms-2"
                id="liveToastBtn"
                onClick={copyText}
              >
                Copy URL
              </button>
            </div>
          </div>
        )}
        <br />
      </div>

      <div className="row features gap-4">
        <div className="col item">
          <h5>Instant Shortening </h5>
          <p>Paste your URL and get a short link instantly.</p>
        </div>
        <div className="col item">
          <h5>Custom Aliases </h5>
          <p>Make your links memorable with your own keywords.</p>
        </div>
        <div className="col item">
          <h5>Click Analytics</h5>
          <p>Track how many times your links are opened.</p>
        </div>
        <div className="col item">
          <h5>No Sign-Up Needed </h5> <p>Get started right away.</p>
        </div>
      </div>
      <br />

      <section className="how-it-works text-center">
        <div className="container">
          <h2>How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="step">
                <div className="step-number">1</div>
                <h5>Paste Your Link</h5>
                <br />
                <p>Drop your long URL in the box.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step">
                <div className="step-number">2</div>
                <h5>Click “Short-it”</h5>
                <br />
                <p>Watch the magic happen instantly.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step">
                <div className="step-number">3</div>
                <h5>Share Anywhere</h5>
                <p>
                  Post your neat, short link on social media, emails, or
                  messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer">
        <h4>Short-it — Making your links shorter, your life easier.</h4>
      </section>
      <br />
    </div>
  );
}
