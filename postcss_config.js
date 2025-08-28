module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          '@fullhuman/postcss-purgecss': {
            content: [
              './pages/**/*.{js,ts,jsx,tsx}',
              './components/**/*.{js,ts,jsx,tsx}',
              './app/**/*.{js,ts,jsx,tsx}',
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: [
              'html',
              'body',
              /^bg-/,
              /^text-/,
              /^border-/,
              /^hover:/,
              /^focus:/,
              /^active:/,
              /^group-hover:/,
              /^animate-/,
              /^transition-/,
            ],
          },
          cssnano: {
            preset: 'default',
          },
        }
      : {}),
  },
};