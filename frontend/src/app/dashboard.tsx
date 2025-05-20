"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [userRole, setUserRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login"); // Redirect if not authenticated
      return;
    }

    // Fetch user role from localStorage or API
    setUserRole(localStorage.getItem("user_role") || "User");

    // Fetch Questions from Django API
    fetch("http://127.0.0.1:8000/api/questions/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userRole}!</h1>
      <Link href="/ask">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Ask a Question
        </button>
      </Link>

      <ul className="mt-4">
        {questions.length > 0 ? (
          questions.map((q: any) => (
            <li key={q.id} className="border p-4 my-2">
              <Link href={`/questions/${q.id}`} className="text-lg font-semibold">
                {q.title}
              </Link>
              <p>{q.body}</p>
            </li>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </ul>
    </div>
  );
}
