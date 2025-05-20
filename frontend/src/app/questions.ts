import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/questions/";
export const fetchQuestions = async () => {
    return axios.get(API_URL);
  };
export const postQuestion = async (title: string, body: string) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("You must be logged in to ask a question.");
    return;
  }

  try {
    const response = await axios.post(
      API_URL,
      { title, body }, // ✅ No username needed
      {
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ Send JWT token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error("Error posting question:", err.response?.data || err.message);
    alert("Failed to post question. Please try again.");
  }
};
