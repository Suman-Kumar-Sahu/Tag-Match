import React from "react";

const JobDescription = ({ jd, setJd }) => {
  return (
    <div className="w-full mt-4 p-4 rounded-xl bg-gray-800 text-gray-200 flex flex-col items-center text-center">
      <label className="block font-semibold mb-3 text-gray-200">2. Paste the Job Description Here...</label>

      <textarea
        rows="5"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        className="w-full max-w-lg p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder="Paste the job description here..."
      ></textarea>
    </div>
  );
};

export default JobDescription;
