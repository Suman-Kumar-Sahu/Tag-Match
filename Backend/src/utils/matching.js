import natural from "natural";
import stringSimilarity from "string-similarity";

// -----------------------------
//  TOKENIZER + TF-IDF SETUP
// -----------------------------
const tokenizer = new natural.WordTokenizer();
// const tfidf = new natural.TfIdf();
const stopwords = new Set(natural.stopwords);


function preprocess(text) {
  return tokenizer
    .tokenize(text.toLowerCase())
    .filter((w) => !stopwords.has(w))
    .map((w) => natural.PorterStemmer.stem(w));
}

// Generate bigrams + trigrams
function generateNgrams(tokens) {
  const ngrams = [];

  // bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    ngrams.push(tokens[i] + " " + tokens[i + 1]);
  }

  // trigrams
  for (let i = 0; i < tokens.length - 2; i++) {
    ngrams.push(tokens[i] + " " + tokens[i + 1] + " " + tokens[i + 2]);
  }

  return ngrams;
}

// -----------------------------
// 2. Build TF-IDF Corpus
// -----------------------------
function buildTfidfCorpus(resumeText, jdText) {
  const tfidf = new natural.TfIdf();

  const resumeTokens = preprocess(resumeText);
  const jdTokens = preprocess(jdText);

  const resumeCorpus = resumeTokens.concat(generateNgrams(resumeTokens)).join(" ");
  const jdCorpus = jdTokens.concat(generateNgrams(jdTokens)).join(" ");

  tfidf.addDocument(resumeCorpus, "resume");
  tfidf.addDocument(jdCorpus, "job");

  return { resumeCorpus, jdCorpus, tfidf };
}

// -----------------------------
// 3. Extract skills
// -----------------------------
export function extractSkills(skillBank) {
  return skillBank.map((skill) => ({
    raw: skill,
    token: preprocess(skill).join(" "),
  }));
}

// -----------------------------
// 4. Compute ATS score
// -----------------------------
export function computeSkillScore(skillBank, resumeText, jdText) {
  const processedSkills = extractSkills(skillBank);
  const { resumeCorpus, jdCorpus, tfidf } = buildTfidfCorpus(resumeText, jdText);


  let matchedSkills = [];
  const MATCH_THRESHOLD = 0.40;

  processedSkills.forEach((skill) => {
    const skillToken = skill.token;

    // TF-IDF scoring
    let tfidfResume = tfidf.tfidf(skillToken, 0);
    let tfidfJD = tfidf.tfidf(skillToken, 1);

    // fuzzy scoring
    let fuzzyResume = stringSimilarity.compareTwoStrings(skillToken, resumeCorpus);
    let fuzzyJD = stringSimilarity.compareTwoStrings(skillToken, jdCorpus);

    // pick strongest representation
    let relevance = Math.max(tfidfResume, tfidfJD, fuzzyResume, fuzzyJD);

    if (relevance >= MATCH_THRESHOLD) {
      matchedSkills.push({
        skill: skill.raw,
        relevance: parseFloat(relevance.toFixed(3)),
      });
    }
  });

  // realistic score: matched / total skills
  const skillScore = (matchedSkills.length / processedSkills.length) * 100;

  const textSimilarity = stringSimilarity.compareTwoStrings(resumeCorpus,jdCorpus);
  
  let finalScore = skillScore*0.7 + (textSimilarity*100)*0.3;

  return {
    finalSkillMatch: parseFloat(finalScore.toFixed(2)),
  };
}


// Add score acording to hard skill, soft skill