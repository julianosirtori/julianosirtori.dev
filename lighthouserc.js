module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/en",
        "http://localhost:3000/pt",
        "http://localhost:3000/pt/blog",
        "http://localhost:3000/pt/about",
        "http://localhost:3000/pt/contact",
        "http://localhost:3000/pt/projects",
      ],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
