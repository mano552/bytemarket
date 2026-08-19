import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    const err = await login(email, password);
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
        <p className="eyebrow">Welcome back</p>
        <h2>Log in to your account</h2>
        {error && <div className="banner banner--error">{error}</div>}

        <GoogleSignInButton onToken={handleGoogleToken} />
        <div className="auth-divider"><span>or continue with email</span></div>

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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="muted">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
