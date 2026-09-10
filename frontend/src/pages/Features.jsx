const features = [
  {
    icon: "bi-lightning-charge",
    title: "Instant shortening",
    text: "Paste a destination and receive an 8-character public alias immediately.",
  },
  {
    icon: "bi-pencil-square",
    title: "Custom aliases",
    text: "Choose a readable slug like launch-day so people remember the link.",
  },
  {
    icon: "bi-graph-up-arrow",
    title: "Click analytics",
    text: "Inspect visit counts, timestamps, and user agents for every short URL.",
  },
  {
    icon: "bi-shield-check",
    title: "Safer defaults",
    text: "Only http(s) destinations are accepted. Local, private, and credentialed URLs are blocked.",
  },
  {
    icon: "bi-speedometer2",
    title: "Rate limited API",
    text: "Write endpoints are throttled so a noisy client cannot flood the database.",
  },
  {
    icon: "bi-braces",
    title: "Ready for production",
    text: "Helmet, CORS, structured errors, health checks, and environment-based config.",
  },
];

export default function Features() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h1>Everything you need to share cleaner links</h1>
          <p>ShortIt is a focused URL shortener, not a bloated marketing suite.</p>
        </div>
        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-6 col-lg-4" key={feature.title}>
              <article className="feature-card h-100">
                <i className={`bi ${feature.icon}`} aria-hidden="true" />
                <h2 className="h5">{feature.title}</h2>
                <p className="mb-0">{feature.text}</p>
              </article>
            </div>
          ))}
        </div>
        <div className="how-grid mt-5">
          <h2>How it works</h2>
          <ol>
            <li>Paste a long URL on the home page.</li>
            <li>Optionally add a custom alias.</li>
            <li>Share the short link anywhere.</li>
            <li>Open Analytics to see who clicked and when.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
