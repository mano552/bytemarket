import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Register: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    const err = await register(name, email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate("/shop");
    }
  }

  async function handleGoogleToken(idToken: string): Promise<void> {
    const err = await loginWithGoogle(idToken);
    if (err) {
      setError(err);
    } else {
      navigate("/shop");
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Get started</p>
        <h2>Create your account</h2>
        {error && <div className="banner banner--error">{error}</div>}

        <GoogleSignInButton onToken={handleGoogleToken} />
        <div className="auth-divider"><span>or continue with email</span></div>

        <label className="field">
          <span>Full Name</span>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="muted">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
