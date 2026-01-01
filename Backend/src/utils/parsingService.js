import pdf from "pdf-parse-fixed";

export const parseToText = async (buffer) => {
  try {
    const data = await pdf(buffer);
    let text = data.text;

    text = text.replace(/\s+/g, " ");
    text = text.replace(/\b(C\+\+|C#|F#)\b/gi, (m) => m.toUpperCase());
    text = text.replace(/\b([A-Za-z]+)\.(js|ts|jsx|tsx)\b/gi,(_, name, ext) => `${name.toLowerCase()} ${ext.toLowerCase()}`);
    text = text.replace(/(?<=\w)\.(?=\w)/g, " ");
    text = text.toLowerCase();

    return text;
  } catch (error) {
    console.error("PDF parse error:", error);
    throw new Error("PDF parsing failed");
  }
};
