const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "custom-properties": false,
      },
    },
  },
};

export default config;
