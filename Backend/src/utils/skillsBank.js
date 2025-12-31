const skillBank = {
  programming: [
    "JavaScript", "TypeScript", "Python", "Java", "CPlusPlus", "CSharp", "C", "Ruby", "Go", "Golang", "PHP", "Rust", "Swift", "Kotlin"
  ],

  frontend: [
    "HTML", "HTML5", "CSS", "CSS3", "SCSS", "Sass","Bootstrap", "TailwindCSS", "Tailwind", "MaterialUI", "MUI",  
    "React", "Reactjs", "Nextjs", "Nuxtjs", "Vue", "Vuejs", "Angular", "Svelte",  "Redux", "ContextAPI", "Zustand", "Recoil",
    "Webpack", "Vite", "Parcel", "Babel"
  ],

  backend: [
    "Nodejs", "Node", "Express", "Expressjs", "Fastify", "Nestjs", "Koa","RESTAPI", "RESTful", "GraphQL", "gRPC", "WebSocket",
    "Microservices", "Serverless","Authentication", "Authorization", "OAuth", "OAuth2","JWT", "bcrypt", "Passportjs",  
    "SessionManagement", "Cookie", "CORS"
  ],

  databases: [
    "MongoDB", "Mongoose","MySQL", "PostgreSQL", "Postgres", "SQL", "SQLite", "Redis", "Firebase", "Firestore", "Supabase"
  ],

  cloud: [
    "AWS", "Azure", "GCP","Lambda", "EC2", "S3", "CloudFront","Heroku", "Vercel", "Netlify"
  ],

  devops: [
    "Docker", "Kubernetes", "K8s","Jenkins", "GitHubActions", "CircleCI", "CICD", "Terraform", "Ansible","Nginx", "Apache", "Linux"
  ],

  versionControl: [
    "Git", "GitHub", "GitLab", "Bitbucket"
  ],

  testing: [
    "Jest", "Mocha", "Chai", "Cypress", "Playwright", "Selenium","UnitTesting", "IntegrationTesting", "E2ETesting",  "TDD", "BDD"
  ],

  tools: [
    "VSCode", "Postman", "Jira", "Notion", "Figma", "Slack"
  ],

  concepts: [
    "OOP", "FunctionalProgramming",  "DataStructures", "Algorithms", "DesignPatterns", "SOLIDPrinciples", "Agile", "Scrum", "Kanban",
    "APIDesign", "SystemDesign",
  ],

  softSkills: [
    "Communication", "Teamwork", "ProblemSolving",  "Leadership", "Adaptability", "TimeManagement", "CriticalThinking"  
  ],
};

const allSkills = Object.values(skillBank).flat();
const uniqueSkills = [...new Set(allSkills)];

export default uniqueSkills;