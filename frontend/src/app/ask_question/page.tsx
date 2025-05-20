// "use client"; // ✅ This must be the FIRST line

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // ✅ Use `useRouter` instead of `useNavigate`
// import { postQuestion } from "../questions"; // ✅ Ensure correct import

// export default function AskQuestion() {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const router = useRouter(); // ✅ Next.js uses `useRouter`

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("You must be logged in to ask a question.");
//       return;
//     }

//     await postQuestion(title, body);
     
//     router.push("/expert");
//     setTimeout(() => router.push("/dashboard"), 3000);
    
//   };

//   return (
//     <div className="min-h-screen p-6 flex flex-col justify-center items-center" style={{ backgroundColor: "#C5F4C1" }}>
//       <h1 className="text-3xl font-bold mb-6 text-center">Ask Your Question</h1>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//       <div className="flex flex-col mb-4">
//         <label className="mb-2 font-semibold text-lg">Title</label>
//         <input
//         className="border p-3 rounded-lg w-full"
//         placeholder="Enter the title of your question"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         />
//       </div>
//       <div className="flex flex-col mb-4">
//         <label className="mb-2 font-semibold text-lg">Description</label>
//         <textarea
//         className="border p-3 rounded-lg w-full h-32"
//         placeholder="Describe your problem in detail..."
//         value={body}
//         onChange={(e) => setBody(e.target.value)}
//         />
//       </div>
//       <button className="bg-blue-500 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-600 transition duration-300">
//         Post Your Question
//       </button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postQuestion } from "../questions";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to ask a question.");
      return;
    }

    await postQuestion(title, body);

    router.push("/expert");
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">🌾 Ask Your Question</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-green-900">Title</label>
            <input
              className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter the title of your question"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-green-900">Description</label>
            <textarea
              className="w-full border border-green-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe your problem in detail..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Post Your Question
          </button>
        </form>
      </div>
    </div>
  );
}
