
import React from "react";

const ResultCard = ({ result }) => {
  if (!result) return null;

  const score = result.score ?? result.data?.score ?? 0;

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (progress / 100) * circumference;

  const missing = result.missing?.length
    ? result.missing
    : result.matchedSkills?.filter(s => s.relevance < 0.45).map(s => s.skill) || [];

  const low = result.lowMatch?.length
    ? result.lowMatch
    : result.matchedSkills?.filter(s => s.relevance >= 0.45 && s.relevance < 0.75).map(s => s.skill) || [];

  return (
    <div className="p-6 mt-1.5 rounded-xl bg-gray-900 text-gray-100 shadow-lg w-full flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-[140px] h-[140px]">
          <svg width="140" height="140" viewBox="0 0 140 140" className="block mx-auto">
            <defs>
              <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            <g transform="translate(70,70)">
              <circle r={radius} cx="0" cy="0" fill="transparent" stroke="#1f2937" strokeWidth="12" />
              <circle r={radius} cx="0" cy="0" fill="transparent" stroke="url(#g1)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90)" />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-3xl font-bold text-teal-300">{progress}%</div>
            <div className="text-xs text-gray-300">ATS Score</div>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Keyword Gaps & Suggestions</h3>

          <ul className="space-y-2">
            {[
              { list: missing, color: "bg-red-600",     icon: "✖", label: "Missing" },
              { list: low,     color: "bg-amber-500",   icon: "!", label: "Low Match" },
            ].filter(({ list }) => list.length > 0).map(({ list, color, icon, label }) => (
              <li key={label} className="flex items-start text-sm text-gray-300">
                <span className={`w-6 h-6 rounded-full ${color} flex items-center justify-center mr-3 mt-0.5 shrink-0`}>
                  {icon}
                </span>
                <span className="text-left">
                  <span className="text-gray-400 mr-1">{label}:</span>
                  {list.slice(0, 2).join(", ")}
                </span>
              </li>
            ))}
          </ul>

          {result.tips?.length > 0 && (
            <div className="mt-4 border-t border-gray-800 pt-4 text-left">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">💡 Improvement Tips</h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                {result.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
