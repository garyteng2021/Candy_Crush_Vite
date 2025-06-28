module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          400: '#667eea',
          500: '#5a67d8',
        },
        purple: {
          600: '#764ba2',
        },
      },
    },
  },
  plugins: [],
};
