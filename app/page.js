import React from 'react';
import { Button } from '@/components/ui/button';
import Head from 'next/head';
import Contect from './_components/Contect';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";
import Image from "next/image";


const page = () => {
  return (
    <div>
      <Head>
        <title>Interview Prep</title>
        <meta name="description" content="Ace your next interview with AI-powered mock interviews" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen font-sans bg-gradient-to-br from-gray-600 to-white text-gray-900">
        {/* Header Section */}
        <header className="w-full py-6 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          {/* Removed horizontal padding by setting px-0 */}
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-0">
            {/* Left: Logo & Title grouped together */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Image src="/logo.svg" width={60} height={60} alt="logo" />
              </Link>
              <Link href="/">
                <h1 className="text-3xl font-extrabold text-red-600 tracking-tight">
                  Interview Prep
                </h1>
              </Link>
            </div>

            {/* Center/Right: Navigation */}
            <nav className="flex flex-col sm:flex-row items-center mt-4 md:mt-0 space-y-2 sm:space-y-0 sm:space-x-6 text-gray-700 font-medium">
              <a href="https://github.com/QAFIR/Interview-Guide" target="_blank" rel="noopener noreferrer">
                <FaGithub className="w-6 h-6 hover:text-blue-600 transition-colors" />
              </a>
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-6 md:px-0 bg-gradient-to-r from-blue-900 to-sky-600 text-white">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">Ace Your Next Interview</h2>
          <p className="mt-4 text-lg md:text-xl opacity-90">Practice with AI-powered mock interviews and get personalized feedback</p>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <a
              href="/dashboard"
              className="px-8 py-3 bg-white text-blue-700 font-semibold text-lg rounded-xl shadow hover:bg-gray-100 transition duration-200"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="px-8 py-3 border border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-blue-700 transition duration-200"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 md:px-0 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800">Features</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
              Our AI Mock Interview platform offers a range of powerful features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Customisable Interviews",
                  desc: "Tailor your mock interviews to match your desired job role and experience level."
                },
                {
                  title: "AI-Powered Feedback",
                  desc: "Get instant, personalized feedback to improve your performance."
                },
                {
                  title: "Detailed Reports",
                  desc: "Receive detailed reports highlighting your strengths and weaknesses."
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-blue-50 rounded-2xl p-8 shadow hover:shadow-lg transition">
                  <h3 className="text-2xl font-semibold text-blue-700">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-slate-50 px-6 md:px-0">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800">User Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
              {[
                {
                  name: "Mansi Singh",
                  quote: "I really loved this. The questions asked were entirely relevant to the Job Role. And the suggestions and feedbacks were quite helpful."
                },
                {
                  name: "Abhiman Singh",
                  quote: "The feedback was spot on and helped me improve my answers. Highly recommend this service!"
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                  <p className="text-gray-600 italic">"{t.quote}"</p>
                  <h4 className="mt-4 font-semibold text-blue-600">– {t.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white px-6 md:px-0">
          <Contect />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-blue-950 text-white text-center text-sm">
        <p>© 2024 Interview Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default page;
