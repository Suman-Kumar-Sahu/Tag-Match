import natural from "natural";
import stringSimilarity from "string-similarity";

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);
const processedSkillCache = new Map();

function preprocess(text) {
  return tokenizer
    .tokenize(text.toLowerCase())
    .filter((w) => !stopwords.has(w) && w.length > 1)
    .map((w) => natural.PorterStemmer.stem(w));
}

function generateNgrams(tokens, n = 2) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

function buildTfidfCorpus(resumeText, jdText) {
  const tfidf = new natural.TfIdf();

  const resumeTokens = preprocess(resumeText);
  const jdTokens = preprocess(jdText);

  const resumeCorpus = resumeTokens.concat(generateNgrams(resumeTokens, 2)).join(" ");
  const jdCorpus = jdTokens.concat(generateNgrams(jdTokens, 2)).join(" ");

  tfidf.addDocument(resumeCorpus, "resume");
  tfidf.addDocument(jdCorpus, "job");

  return { resumeCorpus, jdCorpus, tfidf, resumeTokens, jdTokens };
}

export function extractSkills(skillBank) {
  return skillBank.map((skill) => {
    if (!processedSkillCache.has(skill)) {
      const tokenizedSkill = preprocess(skill).join(" ");
      processedSkillCache.set(skill, tokenizedSkill);
    }
    return {
      raw: skill,
      token: processedSkillCache.get(skill),
    };
  });
}

export function computeSkillScore(skillBank, resumeText, jdText) {
  if (!resumeText || !jdText || !skillBank || skillBank.length === 0) {
    return {
      finalScore: 0,
      matchedSkills: [],
      totalSkillsInJD: 0,
      missingSkills: [],
      textSimilarity: 0,
    };
  }

  console.log('=== ATS SCORE DEBUGGING ===');
  console.log('Resume length:', resumeText.length);
  console.log('JD length:', jdText.length);
  console.log('Skill bank size:', skillBank.length);

  const processedSkills = extractSkills(skillBank);
  const { resumeCorpus, jdCorpus, tfidf, resumeTokens, jdTokens } = buildTfidfCorpus(resumeText, jdText);

  console.log('Resume tokens:', resumeTokens.length);
  console.log('JD tokens:', jdTokens.length);
  console.log('Sample JD tokens:', jdTokens.slice(0, 10).join(', '));

  const maxTfidf = Math.max(
    ...Array.from({ length: tfidf.documents.length }, (_, i) => 
      tfidf.listTerms(i).reduce((max, term) => Math.max(max, term.tfidf), 0)
    ),
    1 
  );

  console.log('Max TF-IDF:', maxTfidf);

  const resumeTokenSet = new Set(resumeTokens);
  const jdTokenSet = new Set(jdTokens);

  let matchedSkills = [];
  const MATCH_THRESHOLD = 0.10; 

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  console.log('\n🎯 Skill Matching:');

  processedSkills.forEach((skill) => {
    const skillToken = skill.token;
    const skillLower = skill.raw.toLowerCase();

    const exactInResume = resumeLower.includes(skillLower);
    const exactInJD = jdLower.includes(skillLower);

    if (exactInResume && exactInJD) {
      matchedSkills.push({
        skill: skill.raw,
        relevance: 1.0,
        method: 'exact'
      });
      return; 
    }

    let tfidfResume = tfidf.tfidf(skillToken, 0) / maxTfidf;
    let tfidfJD = tfidf.tfidf(skillToken, 1) / maxTfidf;

    let inResume = resumeTokenSet.has(skillToken) || resumeTokens.some(t => stringSimilarity.compareTwoStrings(t, skillToken) > 0.8);
    let inJD = jdTokenSet.has(skillToken) || jdTokens.some(t => stringSimilarity.compareTwoStrings(t, skillToken) > 0.8);

    let relevance = (tfidfResume * 0.6) + (tfidfJD * 0.4);

    if (inResume && inJD) relevance *= 1.2;

    if (relevance >= MATCH_THRESHOLD) {
      matchedSkills.push({
        skill: skill.raw,
        relevance: parseFloat(relevance.toFixed(3)),
        method: 'tfidf'
      });
    }
  });

  const skillMap = new Map();
  matchedSkills.forEach(item => {
    if (!skillMap.has(item.skill) || skillMap.get(item.skill).relevance < item.relevance) {
      skillMap.set(item.skill, item);
    }
  });
  matchedSkills = Array.from(skillMap.values());

  console.log('Total matched skills:', matchedSkills.length);
  console.log('Sample matches:', matchedSkills.slice(0, 5).map(s => `${s.skill} (${s.relevance})`));

  const jdSkills = processedSkills.filter(skill => {
    const skillLower = skill.raw.toLowerCase();
    const inJDExact = jdLower.includes(skillLower);
    const inJDTfidf = tfidf.tfidf(skill.token, 1) > 0;
    return inJDExact || inJDTfidf;
  });

  console.log('Skills found in JD:', jdSkills.length);
  console.log('Sample JD skills:', jdSkills.slice(0, 5).map(s => s.raw));

  const matchedSkillNames = new Set(matchedSkills.map(m => m.skill));
  const matchedInResume = jdSkills.filter(skill => matchedSkillNames.has(skill.raw));

  console.log('Matched in resume:', matchedInResume.length);

  const skillCoverage = jdSkills.length > 0 
    ? (matchedInResume.length / jdSkills.length) * 100 
    : 0;

  console.log('Skill coverage:', skillCoverage.toFixed(2) + '%');

  const textSimilarity = stringSimilarity.compareTwoStrings(resumeCorpus, jdCorpus);


  const missingSkills = jdSkills.filter(s => !matchedSkillNames.has(s.raw));

  return {
    finalScore: parseFloat(skillCoverage.toFixed(2)),
    matchedSkills: matchedSkills.sort((a, b) => b.relevance - a.relevance),
    totalSkillsInJD: jdSkills.length,
    missingSkills: missingSkills, 
    textSimilarity: parseFloat((textSimilarity * 100).toFixed(2)),
  };
}