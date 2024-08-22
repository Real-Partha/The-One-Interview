import { useState, useEffect } from "react";

const useTypewriterEffect = (text, delay = 150) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);  // Stop the interval once all characters are added
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return displayedText;
};

export default useTypewriterEffect;
