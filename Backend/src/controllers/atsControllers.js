import { parseToText } from "../utils/parsingService.js";
import { computeSkillScore } from "../utils/matching.js";   
import uniqueSkills from "../utils/skillsBank.js";              

export const atsCheker = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if(!file || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume and Job Description required",
      });
    }

    const allowedTypes = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword'];
    if(!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid file type. Only PDF and DOCX are allowed." });
    }

    if(!jobDescription || typeof jobDescription !== 'string' || jobDescription.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid Job Description is required." });
    }

    let resumeText = "";
    try {
        resumeText = await parseToText(file.buffer);
    } catch (parseError) {
        console.error("Parsing failed:", parseError);
        return res.status(422).json({
          success: false, 
          message: "Could not read the resume file. Please ensure it is not corrupted." });
    }

    if(!resumeText) {
        return res.status(422).json({ 
          success: false, 
          message: "Resume appears to be empty or unreadable." });
    }

    const result = computeSkillScore(uniqueSkills, resumeText, jobDescription);

    return res.status(200).json({
      success: true,
      data: {
        score: result.finalScore,       
        matchedSkills:  result.matchedSkills, 
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
