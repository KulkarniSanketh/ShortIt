import { useState } from "react";
import { sendContact } from "../services/api";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const payload = await sendContact(form);
      setStatus({ type: "success", text: payload.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ type: "danger", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container page-narrow">
        <div className="section-heading">
          <h1>Contact</h1>
          <p>Questions, bugs, or hosting help? Send a note.</p>
        </div>
        <form className="card-surface" onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              className="form-control"
              required
              maxLength={80}
              value={form.name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              required
              maxLength={120}
              value={form.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows={5}
              required
              maxLength={2000}
              value={form.message}
              onChange={onChange}
            />
          </div>
          {status.text && (
            <div
              className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}
              role="alert"
            >
              {status.text}
            </div>
          )}
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
