export default function About() {
  return (
    <section className="section">
      <div className="container page-narrow">
        <div className="section-heading">
          <h1>Links that stay useful</h1>
          <p>ShortIt turns long destinations into simple links that are easier to share, remember, and measure.</p>
        </div>
        <div className="card-surface">
          <p>
            A good short link should do more than save characters. It should make
            the destination clear, give you confidence before sharing, and help
            you understand whether it reached the people you intended.
          </p>
          <p>
            ShortIt keeps that workflow focused: paste a public URL, choose a
            memorable alias if you need one, and share the result. Every link
            keeps a lightweight visit history so you can review its reach later.
          </p>
          <h2 className="h4 mt-4">Built for practical sharing</h2>
          <ul className="stack-list">
            <li>Readable custom aliases for campaigns, events, and teams</li>
            <li>Analytics with click counts, timestamps, and request details</li>
            <li>Validation that accepts public HTTP(S) destinations only</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
