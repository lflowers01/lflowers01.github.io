document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  
  // Theme cycle: default -> dark -> forest -> default
  const themes = ["default", "dark-mode", "forest-mode"];
  let currentThemeIndex = 0;
  
  // Preload images for dark and forest themes
  const preloadImages = () => {
    const darkBg = new Image();
    darkBg.src = new URL("../assets/background.gif", import.meta.url).href;
    
    const forestBg = new Image();
    forestBg.src = new URL("../assets/peen.png", import.meta.url).href;
  };
  
  preloadImages();
  
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "default";
  const savedIndex = themes.indexOf(savedTheme);
  if (savedIndex !== -1) {
    currentThemeIndex = savedIndex;
    applyTheme(savedTheme);
  }
  
  function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove("dark-mode", "forest-mode");
    
    // Apply the selected theme
    if (theme === "dark-mode") {
      document.body.classList.add("dark-mode");
    } else if (theme === "forest-mode") {
      document.body.classList.add("forest-mode");
    }
    
    // Update button text
    updateButtonText(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }
  
  function updateButtonText(theme) {
    const themeNames = {
      "default": "☀️ Default",
      "dark-mode": "🌙 Dark",
      "forest-mode": "🌲 Forest"
    };
    toggleButton.textContent = themeNames[theme] || "Change Theme";
  }
  
  // Toggle through themes on click
  toggleButton.addEventListener("click", () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  });
  
  // Set initial button text
  updateButtonText(themes[currentThemeIndex]);
});
