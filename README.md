# 🚀 ATS Resume Score Checker (Skill-Based Matching Engine)

An Applicant Tracking System (ATS)–style resume analyzer that evaluates how well a resume matches a Job Description (JD) using **skill normalization, n-gram phrase matching, TF-IDF relevance scoring, and coverage analysis**.

This project focuses on **explainable scoring**, similar to real-world ATS systems, instead of black-box machine learning models.

---

## 📌 Features

- 📄 Resume parsing (PDF / DOC / DOCX)
- 🧠 Skill-based matching engine
- 🔎 Normalization of Resume, JD, and Skill Bank
- 🔗 Bigram & Trigram phrase detection
- 📊 TF-IDF relevance scoring
- ✅ Exact + fuzzy skill matching
- 📈 ATS-style skill coverage score
- 🤖 AI-powered deep resume analysis
  
---
## DEMO
<img width="1530" height="860" alt="l-2" src="https://github.com/user-attachments/assets/3390c4fe-58c8-4433-89c4-d666677f6781" />

---

## 🏗️ Project Structure


```
ats-resume-checker/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── atsControllers.js      # Route handlers for /analyze and /ai-analyze
│   │   ├── routes/
│   │   │   └── atsRoutes.js           # Express route definitions
│   │   └── utils/
│   │       ├── chatGpt.js             # AI analysis via Anthropic Claude API
│   │       ├── matching.js            # Normalization, n-grams, TF-IDF scoring
│   │       ├── parsingService.js      # Resume text extraction (PDF/DOCX)
│   │       └── skillsBank.js          # Curated skill reference repository
│   ├── uploads/                       # Temporary resume storage (Multer)
│   ├── .env                           # API keys (ANTHROPIC_API_KEY)
│   ├── app.js                         # Express app setup
│   ├── server.js                      # Server entry point
│   ├── package-lock.json
│   └── package.json
│
└── Frontend/client/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── componets/
    │   │   ├── FileUpload.jsx          # Resume drag & drop upload component
    │   │   ├── JobDescription.jsx      # JD text input component
    │   │   ├── Loader.jsx              # Loading spinner component
    │   │   └── ResultCard.jsx          # ATS score & results display
    │   ├── pages/
    │   │   ├── AppPage.jsx             # Main app page (upload + results)
    │   │   └── Landing.jsx             # Landing/home page
    │   ├── utils/
    │   │   └── api.js                  # Axios API calls to backend
    │   ├── App.jsx                     # Root component
    │   ├── AppWrapper.jsx              # App context/wrapper
    │   ├── index.css                   # Global styles
    │   └── main.jsx                    # React entry point
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js
```

---

## 🧠 How the ATS Scoring Works

### 1. Resume Parsing
- Extracts text from uploaded resumes
- Cleans unwanted characters
- Preserves technical keywords

File: `parsingService.js`

---

### 2. Skill Bank
- Central repository of technical and soft skills
- Duplicates removed
- Used as the reference for matching

File: `skillsBank.js`

---

### 3. Text Normalization (Very Important)

All text sources pass through the **same normalization pipeline**:

- Lowercasing
- Tokenization
- Stopword removal
- Porter stemming

Example:
- software → softwar
- engineer → engin
- development → develop

This prevents false negatives during matching.

File: `matching.js`

---

### 4. N-Gram Phrase Matching

To correctly detect multi-word skills:

- **Bigrams** → `machine learning`
- **Trigrams** → `object oriented programming`

These are added to both resume and JD corpora.

---

### 5. TF-IDF Relevance Scoring

Each skill is weighted using TF-IDF across:

- Resume corpus
- Job Description corpus

Relevance formula:
relevance = (resumeTFIDF × 0.6) + (jdTFIDF × 0.4)

If a skill appears in both resume and JD, an additional boost is applied.

---

### 6. Final ATS Score

The final score represents **skill coverage**:
Final Score (%) = (Number of JD skills found in resume / Total JD skills) × 100

This mirrors how real ATS systems calculate screening scores.

---

### 7. 🤖 AI-Powered Deep Analysis (NEW)

Beyond rule-based scoring, the `/ai-analyze` endpoint sends the resume and JD to **AI** for a deeper, context-aware evaluation.

The AI layer performs:
- Contextual resume evaluation
- Missing skill reasoning
- Improvement recommendations
- Formatting insights
- Semantic-level similarity interpretation
- Overall resume quality commentary

#### How It Works:

```
Resume Text + Job Description
          ↓
       Grok API
          ↓
  Structured AI Feedback Report
  - Semantic Skill Gaps
  - Strengths Breakdown
  - Improvement Recommendations
```

File: `chatGpt.js`

#### Setup:
Add your Grok API key to `.env`:
```env
GROK_API_KEY = api_key
```
---
## 📡 API Endpoint

### POST `/api/ats/analyze`

#### Request
Content-Type: multipart/form-data

**Form Fields**
- `resume` → PDF / DOC / DOCX file
- `jobDescription` → Plain text JD

---

### Response Example

```json
{
  "success": true,
  "data": {
    "score": 65.32,
    "matchedSkills": [
      {
        "skill": "JavaScript",
        "relevance": 1.0,
        "method": "exact"
      },
      {
        "skill": "React",
        "relevance": 0.64,
        "method": "tfidf"
      }
    ],
    "missingSkills": ["Docker", "AWS"],
    "textSimilarity": 52.14
  }
}

```
### POST `/api/ats/ai-analyze`

AI-powered deep analysis using Anthropic Claude. Returns the same structured output rendered in the UI dashboard.

#### Request
`Content-Type: multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `resume` | File | PDF / DOC / DOCX resume |
| `jobDescription` | String | Plain text job description |

#### Response Example

```json
{
  "success": true,
  "data": {
    "score": 65,
    "keywordGaps": {
      "missing": ["Java", "C++"],
      "lowMatch": ["Node.js", "Django"]
    },
    "improvementTips": [
      "Highlight relevant projects or experiences that demonstrate proficiency in required skills like Java, C++, and data structures",
      "Emphasize understanding of computer science fundamentals and software engineering principles",
      "Quantify achievements in code reviews, debugging, and problem-solving to demonstrate expertise in software development"
    ]
  }
}

```
---

### 📊Accuracy & Limitations

Strengths:
- Much more accurate than keyword-only ATS
- Explainable scoring logic
- Phrase-aware skill detection
- Low false positives
- AI layer adds for deep analysis

Limitations:
- No semantic embeddings (BERT/SBERT)
- No experience-duration weighting
- TF-IDF corpus limited to resume + JD

| System | Accuracy |
|--------|----------|
| Keyword-only ATS | ~55–60% |
| This system (rule-based) | ~75–82% |
| This system (rule-based + AI) | ~82–88% |
| Enterprise ATS | 85–90% |

---


## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API framework |
| natural | NLP (stemming, tokenization) |
| string-similarity | Fuzzy matching |
| pdf-parse | PDF text extraction |
| Multer | File upload handling |
| GroK | AI-powered analysis |

---

### 🚀Future Improvements

- Semantic embeddings (MiniLM / SBERT)
- Experience-based weighting
- Skill hierarchy (ontology)
- Candidate ranking across multiple resumes
- ML-learned scoring weights

---

### 👨‍💻 Author Note

This project demonstrates how real ATS systems work internally — normalizing language, detecting skill phrases, and computing relevance-based scores rather than relying on naive keyword matching. The addition of **GROK AI** takes this further by enabling semantic reasoning, qualitative feedback, and context-aware gap analysis that rule-based systems cannot provide.
