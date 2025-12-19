import pdf from "pdf-parse-fixed";

export const parseToText = async (buffer) => {
    try {
        const data = await pdf(buffer);
        let text = data.text
            .replace(/\n/g, " ")
            .replace(/[^a-zA-Z0-9., ]/g, " ")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();

        return text;  
    } catch (error) {
        console.error("PDF parse error:", error);
        throw new Error("PDF parsing failed");
    }
};
