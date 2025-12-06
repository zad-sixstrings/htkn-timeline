import { useState, useEffect, useCallback } from "react";

export function useRotatingLogo(intervalMs = 5000) {
  const [logoFiles, setLogoFiles] = useState(["HTKN.png"]); // Fallback
  const [currentLogo, setCurrentLogo] = useState("HTKN.png");
  const [isGlitching, setIsGlitching] = useState(false);
  const [previousLogos, setPreviousLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch logo list from manifest.json on mount
  useEffect(() => {
    fetch("/logos/manifest.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch manifest: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.logos && data.logos.length > 0) {
          const sortedLogos = [...data.logos].sort();
          setLogoFiles(sortedLogos);
          setCurrentLogo(sortedLogos[0]);
        } else {
          console.warn("⚠️ No logos found in manifest");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading logo manifest:", err);
        console.log("📦 Using fallback logo");
        setIsLoading(false);
      });
  }, []);

  // Get a random logo that's different from the current one
  const getRandomLogo = useCallback(() => {
    if (logoFiles.length === 1) return logoFiles[0];

    // Filter out the current logo to ensure we always get a different one
    const availableLogos = logoFiles.filter((logo) => logo !== currentLogo);
    const randomIndex = Math.floor(Math.random() * availableLogos.length);
    return availableLogos[randomIndex];
  }, [currentLogo, logoFiles]);

  // Change logo with glitch effect
  const changeLogo = useCallback(() => {
    // Start glitch effect
    setIsGlitching(true);

    // Change logo during glitch (midway through animation)
    setTimeout(() => {
      const newLogo = getRandomLogo();
      setPreviousLogos((prev) => [...prev, currentLogo].slice(-3)); // Keep last 3
      setCurrentLogo(newLogo);
    }, 150); // Change halfway through 300ms glitch

    // End glitch effect
    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, [currentLogo, getRandomLogo]);

  // Set up rotation interval
  useEffect(() => {
    if (isLoading || logoFiles.length <= 1) return; // Don't rotate if only one logo

    const interval = setInterval(changeLogo, intervalMs);
    return () => clearInterval(interval);
  }, [changeLogo, intervalMs, isLoading, logoFiles.length]);

  return {
    currentLogo: `/logos/${currentLogo}`,
    isGlitching,
    changeLogo, // Expose for manual trigger if needed
    logoCount: logoFiles.length,
    isLoading,
  };
}
