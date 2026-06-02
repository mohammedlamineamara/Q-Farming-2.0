import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log({
      name,
      email,
      password,
      role,
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Register
      </h1>

      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

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

        <select
          className="w-full border p-2"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="worker">Worker</option>
          <option value="agronomist">Agronomist</option>
          <option value="farm_manager">
            Farm Manager
          </option>
        </select>

        <button
          type="submit"
          className="w-full border p-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}

