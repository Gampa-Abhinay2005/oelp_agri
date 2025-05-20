"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default selection
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error messages
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!agree) {
      setError("You must agree to the terms & policy.");
      return;
    }

    const role = userType === "expert" ? "expert" : "user"; // Map userType to 'role'

    setLoading(true);
    setError(""); // Clear previous error messages

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#C5F4C1" }}>
      <div className="w-1/2 flex flex-col justify-center p-16">
        <h1 className="text-4xl font-bold text-green-900 mb-6">🌱 Agri-science</h1>
        <h2 className="text-3xl font-semibold mb-4">Get Started Now</h2>

        <form onSubmit={handleRegister} className="w-96">
          {error && <div className="text-red-600 mb-4">{error}</div>} {/* Error message */}
          
          <label className="block mb-1 font-medium">Username</label>
          <input
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block mb-1 font-medium">Email address</label>
          <input
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-1 font-medium">Password</label>
          <input
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Dropdown for Selecting User Type */}
          <label className="block mb-1 font-medium">Register as</label>
          <select
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="expert">Expert</option>
          </select>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span>I agree to the terms & policy</span>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#3A5B22" }}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Signup"}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-400" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-400" />
          </div>

          <p className="text-center">
            Have an account? <Link href="/login" className="text-blue-600">Sign In</Link>
          </p>
        </form>
      </div>

      <div className="w-1/2 hidden lg:flex items-center justify-center">
        <img src="/myimage/image.png" alt="Fresh Vegetables Market" className="w-3/4" />
      </div>
    </div>
  );
}
