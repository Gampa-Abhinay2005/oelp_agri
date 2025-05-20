'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-green-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">🌱 About Eco-Friendly Crop Prediction</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 hover:text-green-600 transition-colors duration-300">Our Mission</h2>
          <p className="text-lg text-green-800">
            Our platform aims to support farmers in making data-driven decisions to optimize crop production and yield prediction. 
            By leveraging AI and machine learning, we help farmers choose the most suitable crops based on weather conditions, 
            soil type, and other environmental factors, while also suggesting the ideal fertilizers to boost crop health.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 hover:text-green-600 transition-colors duration-300">What We Do</h2>
          <p className="text-lg text-green-800">
            Using state-of-the-art algorithms, we provide farmers with:
          </p>
          <ul className="list-disc pl-6 mt-4 text-lg text-green-800">
            <li>Personalized crop recommendations based on environmental data</li>
            <li>Fertilizer suggestions to improve crop quality</li>
            <li>Predictions on expected crop yields based on location and season</li>
            <li>Tools for farmers to make informed decisions about land management</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 hover:text-green-600 transition-colors duration-300">For Whom</h2>
          <p className="text-lg text-green-800">
            This platform is designed for farmers, agricultural experts, and anyone interested in optimizing crop production 
            and making environmentally friendly decisions. Whether you are a small-scale farmer or an agricultural consultant, 
            this platform can help you make better decisions about crop selection and farming practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-4 hover:text-green-600 transition-colors duration-300">Get Involved</h2>
          <p className="text-lg text-green-800">
            We believe in the power of community-driven knowledge. If you're an expert in the field of agriculture, feel free to 
            join our platform to share your insights and help others make better farming choices.
          </p>
        </section>

        <div className="mt-8 text-center">
          <a 
            href="/home_page" 
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-300"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
