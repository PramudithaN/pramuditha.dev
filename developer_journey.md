# Pramuditha Nadun - Developer Journey & Portfolio Specifications

This file contains the complete content, structures, styles, and logic from the **Developer Section** of your portfolio. You can use this markdown file directly in your new project to implement the exact same features.

---

## 1. Profile & Bio Information

### Content Details
* **Name**: Pramuditha Nadun
* **Current Title**: Associate Software Engineer & AI Researcher
* **Location**: Sri Lanka (Flag URL: `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/lk.svg`)
* **Profile Image Path**: `/Images/Pramuditha.webp`
* **Resume/CV Path**: `/Documents/Pramuditha_Nadun-Resume.pdf`
* **Profile Summary**:
  > I'm a Software Engineer with a passion for creating web applications. I have experience in both front-end and back-end development, and I'm always eager to learn new technologies and improve my skills. I enjoy collaborating with teams and contributing to projects that make a difference.

### Social Links
* **GitHub**: `https://github.com/PramudithaN`
* **LinkedIn**: `http://www.linkedin.com/in/pramuditha-nadun-612b1b204`
* **Email**: `pramudithanadun@gmail.com`
* **Instagram**: `https://www.instagram.com/pramx.psd?igsh=MWNtaXF2cWw2ajEwcg==`
* **Facebook**: `https://web.facebook.com/pramuditha.nadun`

---

## 2. Skills & Technologies Data

```json
{
  "Web Development": [
    { "text": "HTML", "logo": "mdi:language-html5" },
    { "text": "JavaScript", "logo": "mdi:language-javascript" },
    { "text": "CSS", "logo": "mdi:language-css3" },
    { "text": "Astro", "logo": "simple-icons:astro" },
    { "text": "Tailwind CSS", "logo": "mdi:tailwind" },
    { "text": "Figma", "logo": "mdi:figma" }
  ],
  "Development Tools": [
    { "text": "Visual Studio Code", "logo": "mdi:visual-studio-code" },
    { "text": "Git", "logo": "mdi:git" }
  ],
  "Hosting and Cloud Services": [
    { "text": "Render", "logo": "cib:render" },
    { "text": "Vercel", "logo": "cib:vercel" },
    { "text": "GitHub Pages", "logo": "cib:github" }
  ],
  "Operating Systems": [
    { "text": "Windows", "logo": "mdi:windows" },
    { "text": "Linux", "logo": "mdi:linux" }
  ],
  "Other Programming Languages and Technologies": [
    { "text": "React", "logo": "mdi:react" },
    { "text": "TypeScript", "logo": "mdi:language-typescript" },
    { "text": "Python", "logo": "mdi:language-python" },
    { "text": "Java", "logo": "mdi:language-java" },
    { "text": "Node.js", "logo": "mdi:nodejs" }
  ],
  "Other Software": [
    { "text": "Discord", "logo": "mdi:discord" },
    { "text": "Spotify", "logo": "mdi:spotify" },
    { "text": "Visual Studio", "logo": "mdi:visual-studio" },
    { "text": "Brave", "logo": "cib:brave" }
  ]
}
```

---

## 3. Experience Tree (Timeline Style)

### Complete Experience Data

#### 1. Associate Software Engineer @ LOLC Technologies
* **Duration**: 2024 - Present
* **Role/Team**: Fusion X Team - Frontend Developer
* **Tech Stack**: React, TypeScript, Redux, Ant Design (AntD), Figma, Spring Boot, Jenkins, ArgoCD, Git
* **Key Accomplishments**:
  - Working on software development in a hybrid environment.
  - Mastered React and TypeScript, with a deep understanding of React Hooks and Forms.
  - Worked with state management using Redux for efficient data handling.
  - Gained experience in Ant Design (AntD) for building modern UI components.
  - Enhanced UI/UX skills, including Figma design and user experience improvements.
  - Applied fundamental knowledge of Spring Boot for backend development.
  - Handled deployments to QA, UAT, and Prod environments.
  - Managed screen permissions and user access control.
  - Worked with CI/CD pipelines using Jenkins and ArgoCD.
  - Monitored deployment progress and troubleshooting issues.
  - Gained experience in Git versioning, including Git tags and commands.

#### 2. Trainee Software Engineer @ LOLC Technologies
* **Duration**: Mar 2022 - Oct 2024
* **Role/Team**: Fusion Team - Trainee SE
* **Tech Stack**: React, TypeScript, Figma, Java, Oracle Forms, Jasper Reports
* **Key Accomplishments**:
  - Worked as part of the UI/UX team, creating Figma designs and improving user experience.
  - Gained hands-on experience in frontend development using React and TypeScript.
  - Implemented interactive UI components and responsive layouts.
  - Worked with Java, Oracle Forms, and Jasper Reports for backend and reporting functionalities.
  - Developed and maintained data-driven reports and dashboards for business decision-making.
  - Collaborated with cross-functional teams to deliver software solutions aligned with business requirements.

#### 3. Freelance Developer @ Self-Employed
* **Duration**: 2022 - Present
* **Role/Team**: Independent Full-Stack Developer
* **Tech Stack**: React, Next.js, Spring Boot, Node.js, Tailwind CSS, Automation
* **Key Accomplishments**:
  - Architected and delivered end-to-end full-stack applications for diverse freelance clients, transforming requirements into production-ready software solutions.
  - Developed high-performance, custom web applications utilizing React, Next.js, Spring Boot, and Node.js.
  - Designed and implemented highly responsive, mobile-first websites with clean layouts and semantic markup.
  - Provided expert technical consultations, advising clients on system design, architecture, and technology stack selection.
  - Designed and integrated CI/CD pipelines and deployment automation setups for ongoing client applications to streamline release cycles.

---

### Tree-Style Timeline Implementation Guide

To implement the timeline line with indicators on each item, use a vertical border on the container and an absolute positioned circle on each timeline element:

#### HTML / Tailwind Implementation:
```html
<!-- Experience Container -->
<div class="mt-6 border-l-2 border-gray-200 dark:border-gray-800 pl-6 flex flex-col gap-10">
  
  <!-- Experience Item -->
  <div class="relative">
    <!-- Timeline Dot -->
    <span class="absolute -left-[33px] top-2 h-4 w-4 rounded-full bg-red-600 border-2 border-white dark:border-gray-950"></span>
    
    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
      <!-- Time period -->
      <span class="text-gray-500 dark:text-gray-400 text-sm font-mono w-32 shrink-0">2024 - Present</span>
      
      <div>
        <!-- Job Title & Company -->
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Associate Software Engineer <span class="text-red-600">@ LOLC Technologies</span>
        </h3>
        <div class="text-gray-500 dark:text-gray-400 text-xs mb-1">Fusion X Team - Fullstack Developer</div>
        
        <!-- Summary Bullet Points -->
        <div class="mb-2">
          <span class="font-bold text-sm text-gray-900 dark:text-gray-100">Summary:</span>
          <ul class="list-disc ml-5 text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
            <li>Working on software development in a hybrid environment.</li>
            <li>Mastered React and TypeScript, with a deep understanding of React Hooks and Forms.</li>
            <!-- Add other items here -->
          </ul>
        </div>
        
        <!-- Tech Stack Badges -->
        <div class="flex gap-2 mt-2 flex-wrap">
          <span class="bg-blue-900/20 text-blue-300 border border-blue-900/30 rounded px-2 py-0.5 text-xs flex items-center gap-1">React</span>
          <span class="bg-blue-950/40 text-blue-200 border border-blue-950/50 rounded px-2 py-0.5 text-xs flex items-center gap-1">TypeScript</span>
          <span class="bg-purple-900/20 text-purple-300 border border-purple-900/30 rounded px-2 py-0.5 text-xs">Redux</span>
        </div>
      </div>
    </div>
  </div>

</div>
```

---

## 4. GitHub Projects Integration & API

### API Fetch Logic

To list your live projects, execute a client-side or build-time query to the GitHub repository API. Use the code snippet below to fetch, fallback, and render the projects dynamically:

```typescript
const username = 'PramudithaN';
let repos = [];

try {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  if (res.ok) {
    const rawRepos = await res.json();
    repos = Array.isArray(rawRepos) ? rawRepos.slice(0, 4) : [];
  } else {
    throw new Error('API request failed');
  }
} catch (e) {
  // Fallback to static values if GitHub API rate limit is exceeded
  repos = [
    {
      name: "FraudVista-Frontend",
      html_url: "https://github.com/PramudithaN/FraudVista-Frontend.git",
      description: "A Final Year Project | Frontend Application done using React Typescript-Antd | Fraud Detection System",
      stargazers_count: 0,
      forks_count: 0,
      updated_at: new Date().toISOString(),
      language: "TypeScript",
      topics: ["Academic"],
    },
    {
      name: "dev-portfolio",
      html_url: "https://github.com/PramudithaN/dev-portfolio.git",
      description: "Portfolio website built with Astro, Tailwind CSS, and TypeScript",
      stargazers_count: 5,
      forks_count: 1,
      updated_at: new Date().toISOString(),
      language: "Astro",
      topics: ["portfolio"],
    },
    {
      name: "Algorithm_CW_SlidingPuzzle",
      html_url: "https://github.com/PramudithaN/Algorithm_CW_SlidingPuzzle.git",
      description: "Finding the Start, End nodes and the shortest path of a maze Using A* algorithm-Coursework IIT",
      stargazers_count: 3,
      forks_count: 2,
      updated_at: new Date().toISOString(),
      language: "JavaScript",
      topics: ["Academic"],
    },
    {
      name: "Vapi-Clone_FrontEnd",
      html_url: "https://github.com/PramudithaN/Vapi-Clone_FrontEnd.git",
      description: "Chatbot Management UI developed with Html and Css",
      stargazers_count: 2,
      forks_count: 0,
      updated_at: new Date().toISOString(),
      language: "HTML",
      topics: ["Project"],
    }
  ];
}
```

### Language Badge Tailwind Color Mapping

Use a record mapping programming languages to specific colored Tailwind classes:

```typescript
const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-900/40 text-yellow-200',
  TypeScript: 'bg-blue-900/40 text-blue-200',
  Python: 'bg-blue-900/40 text-blue-200',
  Java: 'bg-orange-900/40 text-orange-200',
  HTML: 'bg-orange-900/40 text-orange-200',
  CSS: 'bg-indigo-900/40 text-indigo-200',
  Shell: 'bg-green-900/40 text-green-200',
  C: 'bg-gray-900/40 text-gray-200',
  'C++': 'bg-pink-900/40 text-pink-200',
  PHP: 'bg-indigo-900/40 text-indigo-200',
  Ruby: 'bg-red-900/40 text-red-200',
  Go: 'bg-cyan-900/40 text-cyan-200',
  Rust: 'bg-orange-900/40 text-orange-200',
  Dart: 'bg-teal-900/40 text-teal-200',
  Swift: 'bg-orange-900/40 text-orange-200',
  Kotlin: 'bg-purple-900/40 text-purple-200',
};
```

---

## 5. Testimonials

These testimonials represent recommendations from colleagues and team members.

### 1. Thavinya Wijesinghe
* **Role**: Senior Business Analyst @ LOLC Technologies
* **Relationship**: Worked together at LOLC Technologies
* **Testimonial Content**:
  > "I had the pleasure of working with Pramuditha during my time at LOLC Technologies, and I can honestly say he’s one of the most well rounded professionals I’ve met. Although his role was as a Software Engineer (FE), he quickly mastered the domain after joining and went beyond what was expected.
  >
  > What makes him stand out is not just his technical skills in FE development, but also his strong eye for design, UI/UX, and even graphics. I've noticed that he has a rare ability to bridge the gap between development, design, and the user experience which is very crucial.
  >
  > Another quality I truly admire in Pramuditha is how collaborative he is. In my opinion, many developers tend to prefer working in isolation, but he performs very well in teamwork. I've seen how he actively engages with BAs and QAs, adding a strong sense of collaboration within the team. On a personal note, I’ve also sought his insights for some of my own projects, especially around UI/UX, and his feedback was not only helpful but also showed how much thought he puts into creating meaningful user experiences.
  >
  > Pramuditha is someone who brings both technical excellence and a human touch to his work, and any team would be lucky to have him."

### 2. Rishara Perera
* **Role**: Marketing Executive
* **Testimonial Content**:
  > "I’ve had the pleasure of working with Pramuditha on several projects, and I can confidently say he is one of the most reliable and talented professionals I’ve collaborated with. His expertise in graphic design and front-end development brings both creativity and technical precision to every project.
  >
  > What stood out to me most is his flexibility and willingness to adapt to changing requirements without ever compromising on quality. He takes full ownership of his work, consistently meeting deadlines while ensuring the output exceeds expectations. Beyond his technical skills, Pramuditha is a true team player who communicates well and makes collaboration seamless.
  >
  > I would highly recommend Pramuditha to anyone looking for someone who can deliver outstanding design and development work while also being dependable and easy to work with."

### 3. Oshidhie Peiris
* **Role**: Associate Quality Assurance Engineer
* **Testimonial Content**:
  > "I’ve had the chance to work with Pramuditha as a QA Engineer, and I can confidently say his work is always clean, well-structured, and reliable. Issues are rare, and even when they come up, he’s quick to collaborate and resolve them smoothly. His attention to detail and quality mindset make him a great teammate and a strong asset to any project."

---

### Interactive Collapsible Testimonials Component (React)

You can use the following React Component directly in your new portfolio project to implement the collapsible Testimonial Cards:

```tsx
import React, { useState } from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, avatarUrl, text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col justify-between">
      <div>
        <p className={`text-foreground text-base mb-4 transition-all duration-300 overflow-hidden ${!isExpanded ? 'line-clamp-3' : ''}`}>
          "{text}"
        </p>
        <button
          type="button"
          className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 mb-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <img src={avatarUrl} alt={`${name} testimonial photo`} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-foreground">{name}</div>
          <div className="text-muted-foreground text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
};
```

---

## 6. Beyond the Code

These highlight your hobbies and creative pursuits outside software engineering:

### 1. Graphic Designer
* **Description**: Crafting visually engaging layouts, digital art, and layouts. I love blending aesthetic beauty with clear functionality to tell stories visually.
* **Icon**: Palette (`lucide:palette`)
* **Link**: `/designer`

### 2. Avid Hiker
* **Description**: Trekking through mountains, exploring scenic wilderness trails, and connecting with nature. Hiking feeds my curiosity and builds resilience.
* **Icon**: Mountain (`lucide:mountain`)
* **Link**: `/hikes`

### 3. VFX Enthusiast
* **Description**: Fascinated by CGI, digital compositing, and cinematic visual effects. Exploring creative editing techniques to bring imaginative scenes to life.
* **Icon**: Clapperboard (`lucide:clapperboard`)
* **Link**: `/designer#visual-effects-title`
