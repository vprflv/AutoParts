import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Основная тёмная палитра
                dark: {
                    950: "#0a0a0a",
                    900: "#121212",
                    850: "#18181b",
                    800: "#27272a",
                    700: "#3f3f46",
                },

                // Фиолетовый неон (главный акцент)
                neon: {
                    purple: "#c026d3",      // Основной
                    pink: "#db2777",        // Акцент
                    violet: "#7e22ce",
                    light: "#e879f9",
                },

                // Дополнительные цвета
                zinc: {
                    950: "#09090b",
                    900: "#18181b",
                    800: "#27272a",
                },
            },

            boxShadow: {
                'neon-purple': '0 0 8px #c026d3, 0 0 20px #c026d3, 0 0 40px rgba(192, 38, 211, 0.5)',
                'neon-pink': '0 0 8px #db2777, 0 0 20px #db2777',
                'neon-glow': '0 0 15px rgba(192, 38, 211, 0.6), 0 0 30px rgba(219, 39, 119, 0.4)',
            },

            backgroundImage: {
                'gradient-neon': 'linear-gradient(135deg, #c026d3 0%, #7e22ce 50%, #6b21a8 100%)',
                'gradient-dark': 'linear-gradient(180deg, #18181b 0%, #0a0a0a 100%)',
            },

            animation: {
                'neon-pulse': 'neonPulse 2s ease-in-out infinite',
            },

            keyframes: {
                neonPulse: {
                    '0%, 100%': { opacity: '1', textShadow: '0 0 10px #c026d3' },
                    '50%': { opacity: '0.85', textShadow: '0 0 20px #db2777' },
                },
            },
        },
    },
    plugins: [],
};

export default config;