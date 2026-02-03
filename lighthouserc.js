module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/en",
        "http://localhost:3000/pt",
        "http://localhost:3000/en/blog",
        "http://localhost:3000/pt/blog",
        "http://localhost:3000/en/about",
        "http://localhost:3000/pt/about",
        "http://localhost:3000/en/contact",
        "http://localhost:3000/pt/contact",
        "http://localhost:3000/en/projects",
        "http://localhost:3000/pt/projects",
      ],
      startServerCommand: "pnpm run start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
