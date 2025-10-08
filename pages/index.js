import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("professional");
  const [output, setOutput] = useState("");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const text = "CV blurb for you";
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (type) => {
    if (!input) {
      setOutput("✨ Type something first!");
      return;
    }
    setOutput("⏳ Generating magic...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, tone, type }),
      });
      const data = await res.json();
      setOutput(data.result || "Something went wrong 😅");
    } catch (err) {
      setOutput("💥 Error — check console.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2E2E2E] flex flex-col items-center justify-center px-6 py-12">
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">
          Say it better. Get hired faster.
        </h1>
        <p className="text-lg mb-8 text-gray-700">
          We write the{" "}
          <span className="text-[#4B8F6C] font-semibold">{typedText}</span>
          <span className="animate-pulse">|</span>
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your job title or skills..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4B8F6C]"
          />

          <div className="w-full mb-4">
            <label className="block text-left text-sm text-gray-700 mb-1">
              Tone:
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4B8F6C]"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="creative">Creative</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleGenerate("resume")}
              className="bg-[#4B8F6C] text-white px-6 py-3 rounded-xl shadow hover:shadow-lg transition"
            >
              Generate Resume
            </button>
            <button
              onClick={() => handleGenerate("cover")}
              className="bg-[#D1BFA3] text-[#2E2E2E] px-6 py-3 rounded-xl shadow hover:shadow-lg transition"
            >
              Generate Cover Letter
            </button>
          </div>
        </div>

        {output && (
          <div className="bg-[#FDFCF9] border border-[#E5E3DE] rounded-2xl shadow-inner p-6 text-lg italic">
            {output}
          </div>
        )}

        <footer className="mt-12 text-sm text-gray-500">
          CVConfetti © {new Date().getFullYear()} — Because first impressions
          should sparkle, not stress you out ✨
        </footer>
      </section>
    </main>
  );
}
