import { useState } from "react";
import FileUpload from "./componets/FileUpload";
import JobDescription from "./componets/JobDescription";
import Loader from "./componets/Loader";
import ResultCard from "./componets/ResultCard";
import { uploadResume } from "./utils/api.js";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleCheck = async () => {
    if (!resume || !jd) {
      alert("Upload resume and paste job description!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jd);

    setLoading(true);
    setResult(null);

    try {
      const { data } = await uploadResume(formData);
      setResult(data);
    } catch (err) {
      alert("Error checking ATS score!");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setResume(null);
    setJd("");
    setResult(null);
    setLoading(false);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black py-12 px-4 flex items-center justify-center">
      <div className={`w-full ${result ? "max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8" : "max-w-xl flex flex-col items-center"}`}>
        <div className={`space-y-6 flex flex-col items-center text-center ${result ? "w-full" : "w-full"}`}>
          <h1 className="text-3xl font-extrabold text-teal-300 mb-2">ATS Resume Checker</h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">Quickly compare your resume against a job description, receive an ATS score, keyword suggestions, and formatting tips to improve match rate.</p>

            <div className={`${result ? "w-full max-w-xl mx-auto" : "w-full"}`}>
              <FileUpload setResume={setResume} resetKey={resetKey} />
              <JobDescription jd={jd} setJd={setJd} />

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCheck}
                  className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow"
                >
                  Check ATS Score
                </button>

                <button
                  onClick={handleClear}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow"
                >
                  Clear All
                </button>
              </div>

              {loading && <Loader />}
            </div>
        </div>

        {result && (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <ResultCard result={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
