import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "../providers/trpc";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess() {
      navigate("/");
    },
    onError(error) {
      setError(error.message);
    },
  });

  const handleLogin = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Login
      </h1>

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >
        <input
          className="w-full border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full border p-2"
        >
          {loginMutation.isPending
            ? "Loading..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}
