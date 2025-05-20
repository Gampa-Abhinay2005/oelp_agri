"use client"; // ✅ This must be the first line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [userRole, setUserRole] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answerBody, setAnswerBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user role from localStorage or API
    setUserRole(localStorage.getItem("user_role") || "User");

    // Fetch Questions from Django API
    fetch("http://127.0.0.1:8000/api/questions/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch question");
        }
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!currentQuestionId || !token || !answerBody.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${currentQuestionId}/answers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: answerBody }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      const newAnswer = await res.json();
      // Update answers for the current question after submission
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === currentQuestionId
            ? { ...question, answers: [newAnswer, ...(question.answers || [])] }
            : question
        )
      );

      setAnswerBody(""); // Clear the answer input
      setShowModal(false); // Close the modal
    } catch (err) {
      console.error("Error posting answer:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-200 to-green-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-green-900 mb-2">🌿 Agri-science Expert Dashboard</h1>
          <p className="text-lg text-green-800">Welcome, Expert! Help users by answering their agriculture questions.</p>
        </header>
  
        <section>
          <ul className="space-y-6">
            {questions.length > 0 ? (
              questions.map((q: any) => (
                <li
                  key={q.id}
                  className="border border-green-300 rounded-xl shadow-sm bg-white p-6 hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Title:</strong> {q.userName}
                    </p>
                    <Link
                      href={`questions/${q.id}`}
                      className="text-xl font-semibold text-green-800 hover:underline"
                    >
                      {q.title}
                    </Link>
                    <p className="text-gray-700 text-sm">{q.body}</p>
                    <button
                      onClick={() => {
                        setCurrentQuestionId(q.id);
                        setShowModal(true);
                      }}
                      className="mt-4 bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition"
                    >
                      Answer This Question
                    </button>
                  </div>
  
                  {q.answers && q.answers.length > 0 && (
                    <div className="mt-5 border-t border-green-200 pt-4 space-y-3">
                      <h3 className="text-md font-semibold text-green-700">Answers</h3>
                      <ul className="space-y-3">
                        {q.answers.map((answer: any) => (
                          <li
                            key={answer.id}
                            className="bg-green-50 border border-green-200 rounded p-3"
                          >
                            <p className="text-sm text-gray-600">
                              <strong>Answered by:</strong> {answer.expert?.username || "Unknown"}
                            </p>
                            <p className="text-gray-800">{answer.body}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-600 text-center">No questions available at the moment.</p>
            )}
          </ul>
        </section>
      </div>
  
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-green-800 mb-4">Submit Your Answer</h2>
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <textarea
                className="border border-green-300 w-full p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write your answer..."
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={5}
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                >
                  Submit Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}
