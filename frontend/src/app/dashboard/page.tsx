// "use client"; // ✅ This must be the first line

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Dashboard() {
//   const [userRole, setUserRole] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     // Fetch user role from localStorage or API
//     setUserRole(localStorage.getItem("user_role") || "User");

//     // Fetch Questions from Django API
//     fetch("http://127.0.0.1:8000/api/questions/", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setQuestions(data))
//       .catch((err) => console.error("Error fetching questions:", err));
//   }, []);

//   return (
//     <div className="min-h-screen p-6" style={{ backgroundColor: "#C5F4C1" }}>
//       <div className="flex justify-between">
//         <h1 className="text-4xl font-bold text-green-900 mb-6">🌱 Agri-science</h1>
//         <Link href="/ask_question">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded">
//             Ask a Question
//           </button>
//         </Link>
//       </div>
      
//       <h1 className="text-2xl font-bold mb-4">Welcome, {userRole}!</h1>
//       <div>
//         <ul className="mt-4">
//           {questions.length > 0 ? (
//             questions.map((q: any) => (
//               <li key={q.id} className="border p-2 my-2 flex justify-center items-center">
//                 <div  style={{backgroundColor: "white", padding: "10px", borderRadius: "10px", width: "30vw", height: "20vh"}}>
//                   <p>{q.userName}</p>
//                   <h4 className="text-lg font-semibold">
//                     {q.title}
//                   </h4>
//                   <p>{q.body}</p>
//                 </div>
                
//               </li>
//             ))
//           ) : (
//             <p>No questions available.</p>
//           )}
//         </ul>
//       </div>
      
//     </div>
//   );
// }

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
      router.push("/login");
      return;
    }

    setUserRole(localStorage.getItem("user_role") || "User");

    fetch("http://127.0.0.1:8000/api/questions/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-16 py-5 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">🌱 Agri-science</h1>
        <ul className="flex gap-10 text-lg font-medium">
          <li><Link href="/home_page">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/dashboard">Contact</Link></li>
          <li><Link href="/pridiction">Predict</Link></li>
        </ul>
      </nav>
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold text-green-800">🌾 AgriConnect</h1>
        <Link href="/ask_question">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-md">
            Ask a Question
          </button>
        </Link>
      </div>
  
      {/* Welcome */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h2 className="text-2xl text-green-900 font-semibold">
          Welcome, <span className="font-bold">{userRole}</span> 👩‍🌾👨‍🌾
        </h2>
        <p className="text-green-700 mt-2">Connect with the farming community and grow together.</p>
      </div>
  
      {/* Feed */}
      <div className="max-w-3xl mx-auto space-y-8">
        {questions.length > 0 ? (
          questions.map((q: any) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">👤 {q.userName}</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  Question #{q.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">{q.title}</h3>
              <p className="text-gray-700 mb-4">{q.body}</p>
  
              {/* Answers */}
              {q.answers?.length > 0 ? (
                <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
                  <h4 className="text-md font-bold text-green-800 mb-3">Answers:</h4>
                  {q.answers.map((ans: any) => (
                    <div key={ans.id} className="mb-3 bg-white p-3 rounded-md shadow-sm">
                      <p className="text-gray-800">💬 {ans.body}</p>
                      <p className="text-sm text-gray-500 mt-1">— {ans.expert?.username}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-2">No answers yet.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No questions available.</p>
        )}
      </div>
    </div>
    </div>
  );
  
}
