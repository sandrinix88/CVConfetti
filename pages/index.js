import { useState, useEffect } from "react";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("professional");
  const [output, setOutput] = useState("");

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

  const generateText = async (type) => {
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
      console.error(err);
      setOutput("💥 Error — check console.");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      alert("Copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CVConfetti.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F4EF] text-[#2E2E2E] font-sans">
      <div className="max-w-[600px] w-full p-8 text-center">
        <h1 className="font-serif text-4xl mb-4">Say it better. Get hired faster.</h1>
        <p className="text-lg mb-8">
          We write the <span className="text-[#4B8F6C] font-semibold">{typedText}</span>
          <span className="ml-1">|</span>
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
          <div className="mb-4 w-full">
            <input
              type="text"
              placeholder="Type your job title or skills..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 rounded-[1rem] border border-gray-300 text-base"
            />
          </div>

          <div className="mb-4 w-full">
            <label className="mr-2">Tone:</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded-[1rem] border border-gray-300 text-base"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="creative">Creative</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          <div>
            <button
              className="bg-[#4B8F6C] text-white px-4 py-3 rounded-[1rem] text-base cursor-pointer m-2 hover:opacity-90"
              onClick={() => generateText("resume")}
            >
              Generate Resume
            </button>
            <button
              className="bg-[#D1BFA3] text-[#2E2E2E] px-4 py-3 rounded-[1rem] text-base cursor-pointer m-2 hover:opacity-90"
              onClick={() => generateText("cover")}
            >
              Generate Cover Letter
            </button>
          </div>
        </div>

        {output && (
          <>
            <div className="bg-[#FDFCF9] border border-[#E5E3DE] p-4 rounded-[1rem] mt-4 italic">{output}</div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCopy}
                className="bg-[#4B8F6C] text-white px-4 py-3 rounded-[1rem] text-base cursor-pointer hover:opacity-90"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="bg-[#4B8F6C] text-white px-4 py-3 rounded-[1rem] text-base cursor-pointer hover:opacity-90"
              >
                Download
              </button>
            </div>
          </>
        )}

        <footer className="mt-8 text-sm text-gray-600">
          CVConfetti © 2025 — Because first impressions should sparkle, not stress you out ✨
        </footer>
      </div>
    </main>
  );
}
