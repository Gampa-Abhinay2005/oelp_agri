"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("role", data.role);  // Save role if needed later
  
      alert("Login successful!");
  
      if (data.role === "expert") {
        router.push("/expert");
      } else if (data.role === "user") {
        router.push("/home_page");
      } else {
        router.push("/home_page"); // fallback
      }
    } else {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#C5F4C1" }}>
      <div className="w-1/2 flex flex-col justify-center p-16">
        <h1 className="text-4xl font-bold text-green-900 mb-6">🌱 Agri-science</h1>
        <h2 className="text-3xl font-semibold mb-2">Welcome back!</h2>
        <p className="mb-6">Enter your credentials to access your account</p>

        <form onSubmit={handleLogin} className="w-96">
          <label className="block mb-1 font-medium">Username</label>
          <input
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block mb-1 font-medium">Password</label>
          <input
            className="w-full h-10 p-2 mb-4 rounded-lg bg-green-100 border border-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between items-center mb-4">
            <a href="#" className="text-blue-600" style={{ paddingLeft: "10px" }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#3A5B22" }}
          >
            Login
          </button>

          <p className="mt-4 text-center">
            Don't have an account? <Link href="/register" className="text-blue-600">Sign Up</Link>
          </p>
        </form>
      </div>

      <div className="w-1/2 hidden lg:flex items-center justify-center">
        <img src="myimage/image.png" alt="Agriculture" className="w-3/4" />
      </div>
    </div>
  );
}
