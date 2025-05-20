"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuestionDetail() {
  const params = useParams();
  const id = params.id as string;

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [answerBody, setAnswerBody] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role || "user");

    const token = localStorage.getItem("access_token");
    if (!id || !token) return;

    // Fetch question details
    fetch(`http://127.0.0.1:8000/api/questions/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch question");
        return res.json();
      })
      .then(setQuestion)
      .catch((err) => console.error("Error fetching question:", err));

    // Fetch answers
    fetch(`http://127.0.0.1:8000/api/questions/${id}/answers/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch answers");
        return res.json();
      })
      .then(setAnswers)
      .catch((err) => console.error("Error fetching answers:", err));
  }, [id]);

  async function handleAnswerSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (userRole !== "expert") {
      alert("Only experts can submit answers.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/questions/${id}/answers/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: answerBody }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const newAnswer = await response.json();
      setAnswers((prev) => [newAnswer, ...prev]);
      setAnswerBody("");
      alert("Answer submitted successfully!");
    } catch (error) {
      console.error("Error posting answer:", error);
      alert("Failed to submit answer.");
    }
  }

  if (!question) {
    return <p className="text-center text-gray-600">Loading question...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-900">{question.title}</h1>
      <p className="text-gray-600">
        Asked by: {question.user?.username || "Unknown"}
      </p>
      <p className="mt-4 text-lg">{question.body}</p>

      {userRole === "expert" && (
        <form onSubmit={handleAnswerSubmit} className="mt-6">
          <textarea
            className="border p-2 w-full rounded mb-2"
            placeholder="Your answer..."
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Answer
          </button>
        </form>
      )}

      {userRole !== "expert" && (
        <p className="text-red-500 mt-4">Only experts can answer questions.</p>
      )}

      <h2 className="text-xl font-semibold mt-8">Expert Answers</h2>
      <ul className="mt-4">
        {answers.length > 0 ? (
          answers.map((a) => (
            <li key={a.id} className="border bg-white rounded p-4 my-2 shadow">
              <p className="font-bold">
                Answered by: {a.expert?.username || "Unknown"}
              </p>
              <p className="mt-2">{a.body}</p>
            </li>
          ))
        ) : (
          <p>No expert answers yet.</p>
        )}
      </ul>
    </div>
  );
}
