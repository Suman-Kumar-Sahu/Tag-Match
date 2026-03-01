import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAi = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        const prompt = `You are an ATS Resume Analyzer.
        Compare the resume with the job description.
        Return JSON in this format only, no markdown, no backticks:
        {
          "missing": [],
          "lowMatch": [],
          "strongMatch": [],
          "tips": []
        }

        Rules:
        - missing: skills/keywords in job description but not in resume
        - lowMatch: skills partially matching or weakly mentioned
        - strongMatch: skills clearly present in both
        - tips: 3 short actionable tips to improve the resume for this specific job

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a professional resume analyzer. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
        });

        const raw = response.choices[0].message.content.replace(/```json|```/g, "").trim();
        const result = JSON.parse(raw);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};