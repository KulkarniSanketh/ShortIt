import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="footer-brand">ShortIt</h5>
            <p className="mb-0">Clean links for campaigns, products, and everyday sharing.</p>
          </div>
          <div className="col-md-4">
            <h6>Explore</h6>
            <div className="d-flex flex-column gap-1">
              <Link to="/features">Features</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="col-md-4">
            <h6>Status</h6>
            <p className="mb-0">Up and running</p>
          <div/>
          </div>
        </div>
        <hr />
        <p className="small mb-0">&copy; {new Date().getFullYear()} ShortIt. All rights reserved.</p>
      </div>
    </footer>
  );
}
