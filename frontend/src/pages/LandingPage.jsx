import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // simple auto slider logic
  const images = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-indigo-400">WorkSpace</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 border border-indigo-400 rounded-lg hover:bg-indigo-500 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Collaborate. <br /> Create. <br />{" "}
            <span className="text-indigo-400">Work Smarter.</span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            WorkSpace is your all-in-one collaboration platform. Build projects,
            manage tasks, chat with your team, and bring your ideas to life — all
            from one place.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition text-lg font-semibold"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-indigo-400 rounded-lg hover:bg-indigo-500 transition text-lg font-semibold"
            >
              Sign In
            </button>
          </div>
        </motion.div>

        <motion.img
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          src={images[currentSlide]}
          alt="workspace demo"
          className="w-full md:w-1/2 rounded-xl shadow-2xl mt-10 md:mt-0 border border-slate-700"
        />
      </section>

      {/* About Section */}
      <section className="py-20 px-10 md:px-20 bg-slate-800 text-center">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-indigo-400 mb-8"
        >
          What is WorkSpace?
        </motion.h3>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
          WorkSpace is built to help teams organize projects, share knowledge,
          and stay in sync. Whether you're a solo freelancer, a startup, or a
          global team, you can create secure spaces for every idea and task.
        </p>
      </section>

      {/* Features Section */}
      <section className="px-10 md:px-20 py-20 bg-slate-900">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-400">
          Powerful Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Real-Time Collaboration",
              desc: "Work with your teammates simultaneously with instant updates and messaging.",
              icon: "⚡",
            },
            {
              title: "Task Management",
              desc: "Keep track of progress with to-do lists, deadlines, and task boards.",
              icon: "📋",
            },
            {
              title: "File Sharing",
              desc: "Upload and share important files securely inside your workspace.",
              icon: "📁",
            },
            {
              title: "Smart Notifications",
              desc: "Never miss updates. Stay informed when someone joins, comments, or completes a task.",
              icon: "🔔",
            },
            {
              title: "Invite & Join Easily",
              desc: "Generate invite links or tokens to onboard your teammates instantly.",
              icon: "🔗",
            },
            {
              title: "Secure & Private",
              desc: "We use advanced encryption and access control to keep your data safe.",
              icon: "🔒",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-slate-800 rounded-2xl shadow-lg text-center border border-slate-700 hover:border-indigo-400 transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h4 className="text-2xl font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-10 md:px-20 bg-slate-800 text-center">
        <h3 className="text-3xl font-bold text-indigo-400 mb-10">What People Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma",
              text: "WorkSpace transformed how our remote team collaborates — it's fast, simple, and reliable.",
            },
            {
              name: "Alex Johnson",
              text: "The real-time sync and easy sharing features make managing projects effortless.",
            },
            {
              name: "Ravi Patel",
              text: "We replaced 3 tools with WorkSpace. It’s our new productivity hub!",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md"
            >
              <p className="text-gray-300 mb-4 italic">“{t.text}”</p>
              <h5 className="text-indigo-400 font-semibold">{t.name}</h5>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-10 bg-gradient-to-r from-indigo-600 to-purple-600">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-6"
        >
          Start collaborating today.
        </motion.h3>
        <p className="text-white mb-8 text-lg">
          Create your first workspace in seconds and invite your team for free.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
        >
          Get Started for Free
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-slate-700 text-gray-400">
        © {new Date().getFullYear()} WorkSpace — Collaborate Better.
      </footer>
    </div>
  );
}
