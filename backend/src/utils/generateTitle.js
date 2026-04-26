export const generateTitle = (text) => {
    if (!text) return "New Session";
    const words = text.trim().split(/\s+/).filter(w => w.length > 2);
    return words.slice(0, 5).join(" ") || "New Thinking Journey";
};