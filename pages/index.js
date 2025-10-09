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
    <main>
      <style>{`
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #F7F4EF; color: #2E2E2E; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        main { max-width: 600px; width: 100%; padding: 2rem; text-align: center; }
        h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; }
        .floating-box { background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .input-container, .tone-container { margin-bottom: 1rem; width: 100%; }
        input, select { width: 100%; padding: 0.75rem; border-radius: 1rem; border: 1px solid #ccc; font-size: 1rem; }
        button { padding: 0.75rem 1.5rem; border: none; border-radius: 1rem; font-size: 1rem; cursor: pointer; margin: 0.5rem; }
        .resume-btn { background: #4B8F6C; color: white; }
        .cover-btn { background: #D1BFA3; color: #2E2E2E; }
        .output { background: #FDFCF9; border: 1px solid #E5E3DE; padding: 1rem; border-radius: 1rem; margin-top: 1rem; font-style: italic; }
        .typed { color: #4B8F6C; font-weight: 600; }
        footer { margin-top: 2rem; font-size: 0.9rem; color: #666; }
      `}</style>

      <h1>Say it better. Get hired faster.</h1>
      <p>
        We write the <span className="typed">{typedText}</span>
        <span>|</span>
      </p>

      <div className="floating-box">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your job title or skills..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="tone-container">
          <label>Tone:</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="creative">Creative</option>
            <option value="confident">Confident</option>
          </select>
        </div>

        <div>
          <button className="resume-btn" onClick={() => generateText("resume")}>
            Generate Resume
          </button>
          <button className="cover-btn" onClick={() => generateText("cover")}>
            Generate Cover Letter
          </button>
        </div>
      </div>

      {output && (
        <>
          <div className="output">{output}</div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCopy}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download
            </button>
          </div>
        </>
      )}

      <footer>
        CVConfetti © 2025 — Because first impressions should sparkle, not stress you out ✨
      </footer>
    </main>
  );
}
