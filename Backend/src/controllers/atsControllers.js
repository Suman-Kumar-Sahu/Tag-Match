import { parseToText } from "../utils/parsingService.js";
import { computeSkillScore } from "../utils/matching.js";   
import skillBank from "../utils/skillsBank.js";              

export const atsCheker = async (req, res) => {
  try {
    const file = req.file?.buffer;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume and Job Description required",
      });
    }

    const resumeText = await parseToText(file);

    // Compute the ATS Score using NLP + TF-IDF + Fuzzy
    const result = computeSkillScore(skillBank, resumeText, jobDescription);

    return res.json({
      success: true,
      data: {
        score: result.finalSkillMatch,       
        matchedSkills: result.matchedSkills, 
      },
    });
  } catch (error) {
    console.error("ATS Checker Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing ATS score",
    });
  }
};
