"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("⚠️ Unable to connect to AI service.");
    }
  };

  return (
    <div className="bg-white font-sans">
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

      {/* Hero Section */}
      <header className="relative w-full h-[483px] overflow-hidden flex items-center justify-center text-center">
        <Image src="/myimage/weather.jpeg" alt="Weather" layout="fill" objectFit="cover" />
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-left text-white">
          <h1 className="text-6xl font-extrabold">Weather</h1>
          <p className="text-xl mt-2">Your Weather, Your Journey. Always a Step Ahead</p>
          <p className="text-xl">with Our Crop recommendation!</p>
        </div>
      </header>

      {/* Agriculture Section */}
      <section className="bg-white py-16">
        <div className="flex justify-between items-center w-[90%] max-w-[1440px] mx-auto h-[900px]">
          {/* Left Images */}
          <div className="relative w-[60%]">
            <img src="/myimage/windmill.jpeg" alt="Windmill" className="w-[650px] h-[700px] rounded-lg shadow-lg" />
            <img src="/myimage/hay.jpeg" alt="Haystack" className="absolute bottom-[-40px] left-[-100px] w-[500px] h-[350px] rounded-lg shadow-lg" />
          </div>

          {/* Right Text */}
          <div className="w-[40%] flex flex-col justify-center items-start pl-8">
            <h1 className="text-[80px] leading-[1.2] font-bold text-green-800">Better</h1>
            <h1 className="text-[80px] leading-[1.2] font-bold text-green-800">Agriculture</h1>
            <h1 className="text-[80px] leading-[1.2] font-bold text-green-800">for Better</h1>
            <h1 className="text-[80px] leading-[1.2] font-bold text-green-800">Future</h1>
            <Link href="/pridiction" className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md shadow-lg text-lg">Discover more</Link>
          </div>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="bg-green-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-8">Connect with us</h2>
        
        {/* Expert Avatars */}
        <div className="flex justify-center flex-wrap gap-6 mb-10">
          <Image src="/myimage/expert1.jpeg" alt="Expert1" width={100} height={100} className="rounded-full shadow-md" />
          <Image src="/myimage/expert4.jpeg" alt="Expert4" width={100} height={100} className="rounded-full shadow-md" />
          <Image src="/myimage/expert3.jpeg" alt="Expert3" width={100} height={100} className="rounded-full shadow-md" />
        </div>

        {/* Expert Tip Box */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
          <Image src="/myimage/expert2.jpeg" alt="Expert" width={50} height={50} className="rounded-full mt-1" />
          <Link href="/dashboard">
            <p className="text-left text-gray-800 text-lg">
              🌟 Get personalized tips from our experts to boost your agricultural success!
            </p>
          </Link>
        </div>
      </section>

      {/* Chatbot Section */}
      <div className="fixed bottom-6 right-6 w-[350px] bg-white border border-green-300 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-bold">🌱 AgriBot</h3>
          <span className="text-sm">AI Assistant</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4 py-3 overflow-y-auto max-h-64 space-y-3">
          {response ? (
            <>
              <div className="bg-green-100 rounded-md px-3 py-2 shadow-sm text-sm self-end w-fit max-w-[90%] ml-auto">
                <p><strong>You:</strong> {message}</p>
              </div>
              <div className="bg-gray-100 rounded-md px-3 py-2 shadow-sm text-sm w-fit max-w-[90%]">
                <p><strong>AgriBot:</strong> {response}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Start chatting with AgriBot 🌿</p>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 flex gap-2 flex-wrap bg-green-50 border-t border-b border-green-200">
          {["What can I ask?", "Tips for Rabi crop?", "Fertilizer for sugarcane?"].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setMessage(prompt);
                sendMessage();
              }}
              className="bg-white border border-green-300 text-green-800 text-xs px-3 py-1 rounded-full hover:bg-green-100 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="px-4 py-3 bg-white">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full text-sm px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
}
