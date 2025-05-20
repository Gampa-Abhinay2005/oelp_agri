"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";

export default function QuestionAnswersPage() {
  const params = useParams();
  const id = params?.id as string;

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [answerBody, setAnswerBody] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    setUserRole(role || "user");

    if (!id || !token) return;

    // Fetch question
    fetch(`http://127.0.0.1:8000/api/questions/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch question");
        return res.json();
      })
      .then(setQuestion)
      .catch((err) => console.error(err));

    // Fetch answers
    fetch(`http://127.0.0.1:8000/api/questions/${id}/answers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch answers");
        return res.json();
      })
      .then(setAnswers)
      .catch((err) => console.error("Error fetching answers:", err));
  }, [id]);

  const handleAnswerSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userRole !== "expert") {
      alert("Only experts can submit answers.");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${id}/answers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: answerBody }),
      });

      if (!res.ok) throw new Error("Failed to post answer");
      const newAnswer = await res.json();
      setAnswers((prev) => [newAnswer, ...prev]);
      setAnswerBody("");
    } catch (err) {
      console.error("Error posting answer:", err);
    }
  };

  if (!question) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{question.title}</h1>
      <p className="text-gray-600 mb-4">
        Asked by: {question.user?.username || "Unknown"}
      </p>
      <p className="mb-6">{question.body}</p>

      {userRole === "expert" ? (
        <form onSubmit={handleAnswerSubmit} className="mb-6">
          <textarea
            className="border w-full p-2 mb-2"
            placeholder="Write your answer..."
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">
            Submit Answer
          </button>
        </form>
      ) : (
        <p className="text-red-600 mb-6">Only experts can post answers.</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Answers</h2>
      {answers.length > 0 ? (
        <ul>
          {answers.map((ans) => (
            <li key={ans.id} className="border p-4 mb-2">
              <p className="font-semibold">
                Answered by: {ans.expert?.username || "Unknown"}
              </p>
              <p>{ans.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers yet.</p>
      )}
    </div>
  );
}
