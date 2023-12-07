/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}"
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            }
        },
        extend: {
            height: {
                4.5: "18px"
            },
            colors: {
                black: {
                    50: "#1b1c1d",
                    150: "#141516",
                    250: "#000000B3"
                },
                white: {
                    50: "#ffffff80"
                },
                red: {
                    550: "#d0021b"
                },
                green: {
                    50: "#b2f2a3",
                    350: "#36cb12",
                    450: "#28a909"
                },
                gray: {
                    50: "#414148"
                }
            },
            borderRadius: {
                "2.5xl": "20px"
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" }
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out"
            }
        }
    },
    plugins: [import("tailwindcss-animate")]
};
