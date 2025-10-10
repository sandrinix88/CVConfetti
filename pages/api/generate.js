export default async function handler(req, res) {
  // Method check
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ result: "Method Not Allowed", meta: { ok: false, code: "METHOD_NOT_ALLOWED" } });
  }

  try {
    const { input, tone, type } = req.body || {};

    // Basic validation
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        result: "Please provide some input text.",
        meta: { ok: false, code: "BAD_INPUT", field: "input" },
      });
    }

    // Length validation
    if (input.length > 200) {
      return res.status(400).json({
        result: "Input too long — please keep it under 200 characters.",
        meta: { ok: false, code: "INPUT_TOO_LONG", field: "input", max: 200 },
      });
    }

    const allowedTones = ["professional", "friendly", "creative", "confident"];
    if (tone && !allowedTones.includes(tone)) {
      return res.status(400).json({
        result: `Tone must be one of: ${allowedTones.join(", ")}.`,
        meta: { ok: false, code: "BAD_TONE", field: "tone" },
      });
    }

    const allowedTypes = ["resume", "cover"];
    const safeType = allowedTypes.includes(type) ? type : "resume";
    const safeTone = tone && allowedTones.includes(tone) ? tone : "professional";

    // Deterministic mock output per project memory: always return hardcoded response
    // This keeps the API fast and avoids external dependencies.
    const mockResult =
      safeType === "resume"
        ? `A ${safeTone} resume blurb for "${input}": Results-driven professional with a track record of delivering measurable impact. Communicates clearly, collaborates effectively, and adapts quickly to new challenges.`
        : `A ${safeTone} cover letter for "${input}": I'm excited to apply my skills to drive outcomes, partner cross-functionally, and solve problems with clarity and empathy.`;

    return res.status(200).json({
      result: mockResult,
      meta: { ok: true, code: "OK", tone: safeTone, type: safeType },
    });
  } catch (error) {
    console.error("/api/generate error:", error);
    return res.status(500).json({
      result: "💥 Error generating text.",
      meta: { ok: false, code: "INTERNAL_ERROR" },
    });
  }
}
