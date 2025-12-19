import React, { useState, useCallback, useRef, useEffect } from "react";

const FileUpload = ({ setResume, resetKey }) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) {
        setFileName(f.name);
        setResume(f);
      }
    },
    [setResume]
  );

  const inputRef = useRef(null);

  // clear local fileName and native input when parent increments resetKey
  useEffect(() => {
    if (typeof resetKey === "undefined") return;
    setFileName(null);
    if (inputRef.current) inputRef.current.value = null;
  }, [resetKey]);

  return (
    <div className="w-full p-6 rounded-xl bg-gray-900 text-white shadow-lg flex flex-col items-center text-center relative">
      <label className="block font-semibold mb-3 text-gray-200">1. Provide Your Documents</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`w-full h-44 rounded-lg flex flex-col items-center justify-center border-2 ${
          dragOver ? "border-teal-400" : "border-teal-300/40"
        } bg-linear-to-b from-transparent to-gray-800/30 p-4`}
      >
        <div className="w-20 h-20 rounded-lg bg-teal-700/10 border-2 border-teal-400 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v12m0 0l-4-4m4 4l4-4M21 21H3" />
          </svg>
        </div>

        <div className="text-center ">
          <div className="inline-flex px-4 py-2 rounded-md bg-teal-600 text-sm font-medium text-white mb-2">Drag & Drop Upload</div>
          <div className="text-gray-300 text-sm">Drag & drop your resume here, or browse files.</div>
          {fileName && <div className="mt-2 text-xs text-teal-200">Selected: {fileName}</div>}
        </div>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              setFileName(f.name);
              setResume(f);
            }
          }}
          ref={inputRef}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUpload;
