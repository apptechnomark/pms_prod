import { useEffect, useState } from "react";

const IdleTimer = ({ timeout = 600000, onIdle }: any) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: any;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIdle(true);
        onIdle && onIdle();
      }, timeout);
    };

    const handleMouseMove = () => {
      setIdle(false);
      resetTimer();
    };

    // Initial setup
    resetTimer();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleMouseMove);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleMouseMove);
    };
  }, [timeout, onIdle]);
  return <></>;
};

export default IdleTimer;
