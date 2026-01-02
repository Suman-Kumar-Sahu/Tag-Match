import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import AppPage from "./pages/AppPage";

export default function AppWrapper() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (visited) {
      setShowLanding(false);
    }
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem("visited", "true");
    setShowLanding(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <Landing key="landing" onFinish={handleFinish} />
      ) : (
        <AppPage key="app" />
      )}
    </AnimatePresence>
  );
}