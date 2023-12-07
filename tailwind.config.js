/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        // colors: {
        //     green: {
        //         50: "#b2f2a3"
        //     }
        // },
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
            }
        }
    },
    plugins: []
};
