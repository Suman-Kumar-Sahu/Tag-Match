const skillBank = {
  programming: [
    "javascript", "typescript", "python", "java", "c++", "c", "ruby",
    "go", "php", "sql"
  ],

  frontend: [
    "html", "css", "scss", "bootstrap", "tailwind", "material ui",
    "react", "react.js", "next.js", "redux", "context api",
    "typescript", "vite", "webpack"
  ],

  backend: [
    "node.js", "node", "express", "rest api", "graphql",
    "microservices", "authentication", "authorization",
    "jwt", "bcrypt", "session management"
  ],

  databases: [
    "mongodb", "mongoose", "mysql", "postgresql", "postgres",
    "sqlite", "redis", "firebase"
  ],

  cloud: [
    "aws", "azure", "gcp", "cloud functions",
    "lambda", "ec2", "s3", "cloudfront"
  ],

  devops: [
    "docker", "kubernetes", "k8s", "jenkins",
    "ci/cd", "git", "github actions", "terraform", "ansible"
  ],

  testing: [
    "jest", "mocha", "chai", "cypress", "playwright",
    "unit testing", "integration testing"
  ],

  tools: [
    "git", "github", "postman", "jira", "notion",
    "figma", "visual studio code", "vscode"
  ],

  softSkills: [
    "communication", "teamwork", "problem solving",
    "leadership", "adaptability", "time management",
    "critical thinking"
  ],
};

export default Object.values(skillBank).flat();
