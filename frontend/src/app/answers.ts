import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const fetchAnswers = async (questionId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("User is not authenticated!");
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/questions/${questionId}/answers/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error("Error fetching answers:", err.response?.data || err.message);
    return [];
  }
};


export async function postAnswer(questionId: number, body: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/questions/${questionId}/answers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    throw new Error("Failed to post answer");
  }

  return await res.json();
}
