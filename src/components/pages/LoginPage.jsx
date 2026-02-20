import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, loading, saveAuthData } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required.");
      return;
    }

    setError("");

    try {
      const response = await fetch("/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          schoolEmail: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Invalid credentials");
        return;
      }

      const meRes = await fetch("/v1/admin/me", {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        setError("Session not established. Try again.");
        return;
      }

      const userData = await meRes.json();
      saveAuthData(userData);

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md space-y-6">

        <div className="text-center">
          <img
            src="https://d3vmvj34imavjj.cloudfront.net/emails/braingrades_logo.png"
            alt="Logo"
            className="w-32 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold">Organization Login</h2>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Organization Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Organization Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
