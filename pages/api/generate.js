import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { input, tone, type } = req.body;

    const prompt = `Write a ${tone} ${
      type === "resume" ? "resume blurb" : "cover letter"
    } for someone with this job or skill: "${input}".`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "💥 Error generating text." });
  }
}
