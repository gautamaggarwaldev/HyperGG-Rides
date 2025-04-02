// Add this to your tailwind.config.js

module.exports = {
  // ... your existing config
  theme: {
    extend: {
      // ... your existing extensions
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        bounce: "bounce 1s infinite",
      },
    },
  },

};
