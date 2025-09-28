import { Link } from "react-router";

export default function NotFound() {
    return (
        <div style={{ padding: "1rem" }}>
          <h2>Error 404: page not found.</h2>
          <p>Sorry, the page that you requested doesn't exist.</p>
          <Link to="/">Return home</Link>
        </div>
    );
}