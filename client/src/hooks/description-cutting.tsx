export const truncateText = (text: string, maxWords = 10) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return `${words.slice(0, maxWords).join(" ")}...`;
};

export const truncateTextletter = (name: string, maxLength: number = 30): string => {
  if (!name || name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
};