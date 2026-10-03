export interface RoadmapStageMeta {
  courseSlug: string;
  courseTitle: string;
  whyRequired: string;
  prerequisites: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
}

const SKILL_STAGE_METAS: Record<string, Partial<RoadmapStageMeta>> = {
  // Python & Programming
  'python': {
    courseSlug: 'python-programming',
    courseTitle: 'Python Programming',
    whyRequired: 'Core programming language for automation, backend logic, and data analysis pipelines.',
    prerequisites: 'Basic computer literacy & logic',
    difficulty: 'beginner',
    duration: '3 weeks (~25 hours)',
  },
  'python-programming': {
    courseSlug: 'python-programming',
    courseTitle: 'Python Programming',
    whyRequired: 'Build modular, reusable scripts and software to automate complex tasks.',
    prerequisites: 'Basic computer literacy & logic',
    difficulty: 'beginner',
    duration: '4 weeks (~30 hours)',
  },

  // SQL & Databases
  'sql': {
    courseSlug: 'sql-fundamentals',
    courseTitle: 'SQL & Database Fundamentals',
    whyRequired: 'Query, join, aggregate, and validate relational data directly from production databases.',
    prerequisites: 'Basic understanding of tables and spreadsheets',
    difficulty: 'beginner',
    duration: '2 weeks (~20 hours)',
  },
  'sql-fundamentals': {
    courseSlug: 'sql-fundamentals',
    courseTitle: 'SQL & Database Fundamentals',
    whyRequired: 'Master database architecture, joins, grouping, indexing, and transactional queries.',
    prerequisites: 'Basic table concepts',
    difficulty: 'beginner',
    duration: '3 weeks (~25 hours)',
  },
  'databases': {
    courseSlug: 'sql-fundamentals',
    courseTitle: 'SQL & Database Fundamentals',
    whyRequired: 'Architect scalable schemas, normalize tables, and store application states reliably.',
    prerequisites: 'Basic computer literacy',
    difficulty: 'beginner',
    duration: '2 weeks (~18 hours)',
  },
  'postgresql': {
    courseSlug: 'sql-fundamentals',
    courseTitle: 'SQL & Database Fundamentals',
    whyRequired: 'Industry-standard open-source relational database for web services and analytics.',
    prerequisites: 'SQL fundamentals',
    difficulty: 'intermediate',
    duration: '2 weeks (~15 hours)',
  },

  // Data Analytics, Excel, Statistics & Visualization
  'data-analytics': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals',
    whyRequired: 'Clean messy data, calculate metrics, and build business intelligence dashboards.',
    prerequisites: 'Basic numeracy and spreadsheet familiarity',
    difficulty: 'beginner',
    duration: '3 weeks (~25 hours)',
  },
  'excel': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Excel & Stats)',
    whyRequired: 'The universal language of business teams for rapid ad-hoc calculations and summaries.',
    prerequisites: 'Basic arithmetic & computer literacy',
    difficulty: 'beginner',
    duration: '2 weeks (~15 hours)',
  },
  'statistics': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Statistics)',
    whyRequired: 'Validate statistical significance, avoid misleading biases, and quantify variance.',
    prerequisites: 'High school math & algebra',
    difficulty: 'intermediate',
    duration: '2 weeks (~18 hours)',
  },
  'pandas': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Pandas)',
    whyRequired: 'High-speed tabular data manipulation, filtering, merging, and transformations.',
    prerequisites: 'Python basics',
    difficulty: 'intermediate',
    duration: '2 weeks (~20 hours)',
  },
  'data-visualization': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Visual Dashboards)',
    whyRequired: 'Translate complex numbers into clear charts that executive decision-makers understand.',
    prerequisites: 'Excel or Python basics',
    difficulty: 'intermediate',
    duration: '2 weeks (~16 hours)',
  },
  'power-bi': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Power BI & Dashboards)',
    whyRequired: 'Build self-service business intelligence dashboards connected to live data sources.',
    prerequisites: 'Excel & basic SQL',
    difficulty: 'intermediate',
    duration: '2 weeks (~18 hours)',
  },
  'tableau': {
    courseSlug: 'data-analytics',
    courseTitle: 'Data Analytics Fundamentals (Tableau)',
    whyRequired: 'Create interactive visual stories and executive reporting dashboards.',
    prerequisites: 'Spreadsheet basics',
    difficulty: 'intermediate',
    duration: '2 weeks (~18 hours)',
  },

  // Web Development, Frontend, React & APIs
  'web-development': {
    courseSlug: 'web-development',
    courseTitle: 'Web Development Fundamentals',
    whyRequired: 'Understand how internet protocols, HTML, CSS, and client-server architectures interact.',
    prerequisites: 'None (beginner friendly)',
    difficulty: 'beginner',
    duration: '4 weeks (~30 hours)',
  },
  'html': {
    courseSlug: 'web-development',
    courseTitle: 'Web Development Fundamentals (HTML/CSS)',
    whyRequired: 'Semantic structure of digital web interfaces, accessibility, and SEO.',
    prerequisites: 'Basic computer navigation',
    difficulty: 'beginner',
    duration: '1 week (~10 hours)',
  },
  'css': {
    courseSlug: 'web-development',
    courseTitle: 'Web Development Fundamentals (CSS Layouts)',
    whyRequired: 'Styling, responsive design, Flexbox, and CSS Grid for cross-device layouts.',
    prerequisites: 'HTML basics',
    difficulty: 'beginner',
    duration: '2 weeks (~15 hours)',
  },
  'javascript': {
    courseSlug: 'web-development',
    courseTitle: 'Web Development Fundamentals (JavaScript)',
    whyRequired: 'The core programming language that adds interactivity, events, and API calls to web pages.',
    prerequisites: 'HTML & CSS basics',
    difficulty: 'intermediate',
    duration: '3 weeks (~25 hours)',
  },
  'react': {
    courseSlug: 'web-development',
    courseTitle: 'Web Development Fundamentals (React)',
    whyRequired: 'Component-based single-page application framework used by top technology companies.',
    prerequisites: 'JavaScript ES6+',
    difficulty: 'intermediate',
    duration: '3 weeks (~25 hours)',
  },
  'git': {
    courseSlug: 'git-github',
    courseTitle: 'Git & GitHub Mastery',
    whyRequired: 'Track changes, collaborate with engineering squads, and manage release branches safely.',
    prerequisites: 'Basic terminal navigation',
    difficulty: 'beginner',
    duration: '2 weeks (~15 hours)',
  },
  'git-github': {
    courseSlug: 'git-github',
    courseTitle: 'Git & GitHub Mastery',
    whyRequired: 'Professional distributed version control, pull requests, code reviews, and CI automation.',
    prerequisites: 'Terminal navigation',
    difficulty: 'beginner',
    duration: '4 weeks (~20 hours)',
  },

  // Data Structures & Algorithms
  'data-structures-algorithms': {
    courseSlug: 'data-structures-algorithms',
    courseTitle: 'Data Structures & Algorithms',
    whyRequired: 'Build high-performance, optimal software and conquer technical problem-solving interviews.',
    prerequisites: 'Programming fundamentals',
    difficulty: 'intermediate',
    duration: '8 weeks (~40 hours)',
  },
  'dsa': {
    courseSlug: 'data-structures-algorithms',
    courseTitle: 'Data Structures & Algorithms',
    whyRequired: 'Master time-space complexity, trees, graphs, and dynamic programming.',
    prerequisites: 'Programming fundamentals',
    difficulty: 'intermediate',
    duration: '8 weeks (~40 hours)',
  },
  'algorithms': {
    courseSlug: 'data-structures-algorithms',
    courseTitle: 'Data Structures & Algorithms',
    whyRequired: 'Formulate optimal computational logic and asymptotic time bounds.',
    prerequisites: 'Basic programming & math',
    difficulty: 'intermediate',
    duration: '4 weeks (~25 hours)',
  },

  // Cloud Computing
  'cloud-computing': {
    courseSlug: 'cloud-computing',
    courseTitle: 'Cloud Computing Fundamentals',
    whyRequired: 'Deploy, scale, and secure virtualized infrastructure on AWS, Azure, and GCP.',
    prerequisites: 'Networking fundamentals & command line basics',
    difficulty: 'beginner',
    duration: '6 weeks (~30 hours)',
  },
  'aws': {
    courseSlug: 'cloud-computing',
    courseTitle: 'Cloud Computing Fundamentals',
    whyRequired: 'Provision compute, S3 object storage, VPC networks, and serverless backends.',
    prerequisites: 'Operating systems & networking',
    difficulty: 'intermediate',
    duration: '4 weeks (~25 hours)',
  },

  // Linux & System Administration
  'linux': {
    courseSlug: 'linux-system-administration',
    courseTitle: 'Linux & System Administration',
    whyRequired: 'The ubiquitous foundation of cloud servers, containers, and deployment infrastructure.',
    prerequisites: 'Basic computer literacy',
    difficulty: 'beginner',
    duration: '4 weeks (~20 hours)',
  },
  'linux-system-administration': {
    courseSlug: 'linux-system-administration',
    courseTitle: 'Linux & System Administration',
    whyRequired: 'Manage processes, file permissions, shell automation, and secure remote SSH hosts.',
    prerequisites: 'Basic computer literacy',
    difficulty: 'beginner',
    duration: '5 weeks (~25 hours)',
  },

  // DevOps & CI/CD
  'devops': {
    courseSlug: 'devops-engineering',
    courseTitle: 'DevOps & CI/CD Engineering',
    whyRequired: 'Automate build, test, and release pipelines with Docker and Kubernetes.',
    prerequisites: 'Git & Linux fundamentals',
    difficulty: 'intermediate',
    duration: '6 weeks (~30 hours)',
  },
  'devops-engineering': {
    courseSlug: 'devops-engineering',
    courseTitle: 'DevOps & CI/CD Engineering',
    whyRequired: 'Construct scalable GitOps delivery pipelines and container orchestration clusters.',
    prerequisites: 'Linux & Git basics',
    difficulty: 'intermediate',
    duration: '7 weeks (~35 hours)',
  },
  'docker': {
    courseSlug: 'devops-engineering',
    courseTitle: 'DevOps & CI/CD Engineering (Docker & Containers)',
    whyRequired: 'Package software into immutable, reproducible container environments.',
    prerequisites: 'Linux basics',
    difficulty: 'intermediate',
    duration: '3 weeks (~18 hours)',
  },
  'kubernetes': {
    courseSlug: 'devops-engineering',
    courseTitle: 'DevOps & CI/CD Engineering (Kubernetes)',
    whyRequired: 'Orchestrate distributed container fleets with auto-scaling and zero downtime.',
    prerequisites: 'Docker & networking',
    difficulty: 'advanced',
    duration: '4 weeks (~25 hours)',
  },

  // Cybersecurity
  'cybersecurity': {
    courseSlug: 'cybersecurity-fundamentals',
    courseTitle: 'Cybersecurity Fundamentals',
    whyRequired: 'Protect organizational networks, applications, and customer data from breaches.',
    prerequisites: 'Networking and web fundamentals',
    difficulty: 'beginner',
    duration: '6 weeks (~30 hours)',
  },
  'cybersecurity-fundamentals': {
    courseSlug: 'cybersecurity-fundamentals',
    courseTitle: 'Cybersecurity Fundamentals',
    whyRequired: 'Master threat modeling, OWASP Top 10 vulnerabilities, cryptography, and SOC response.',
    prerequisites: 'Networking basics',
    difficulty: 'beginner',
    duration: '6 weeks (~30 hours)',
  },

  // Software Engineering & System Design
  'software-engineering': {
    courseSlug: 'software-engineering',
    courseTitle: 'Software Engineering & System Design',
    whyRequired: 'Architect maintainable, scalable software following SOLID principles and Agile practices.',
    prerequisites: 'Object-oriented programming proficiency',
    difficulty: 'intermediate',
    duration: '6 weeks (~30 hours)',
  },

  // Mobile App Development
  'mobile-app-development': {
    courseSlug: 'mobile-app-development',
    courseTitle: 'Mobile App Development',
    whyRequired: 'Build responsive, cross-platform Android and iOS apps with local persistence and APIs.',
    prerequisites: 'JavaScript or modern programming basics',
    difficulty: 'beginner',
    duration: '7 weeks (~35 hours)',
  },
  'mobile': {
    courseSlug: 'mobile-app-development',
    courseTitle: 'Mobile App Development',
    whyRequired: 'Construct touch-friendly mobile layouts, offline storage, and push notifications.',
    prerequisites: 'Programming basics',
    difficulty: 'beginner',
    duration: '5 weeks (~25 hours)',
  },
};

export function getRoadmapStageMeta(title: string, skillSlug?: string): RoadmapStageMeta {
  const normalizedTitle = title.toLowerCase().replace(/^learn\s+/i, '').trim();
  const normalizedSlug = (skillSlug || normalizedTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Exact slug match
  if (SKILL_STAGE_METAS[normalizedSlug]) {
    const meta = SKILL_STAGE_METAS[normalizedSlug];
    return {
      courseSlug: meta.courseSlug || 'courses',
      courseTitle: meta.courseTitle || 'Related Course',
      whyRequired: meta.whyRequired || `Core competency in ${title} required for real-world production performance.`,
      prerequisites: meta.prerequisites || 'Foundational stage completion',
      difficulty: meta.difficulty || 'beginner',
      duration: meta.duration || '2 weeks (~15 hours)',
    };
  }

  // Substring match in key
  for (const [key, val] of Object.entries(SKILL_STAGE_METAS)) {
    if (normalizedSlug.includes(key) || normalizedTitle.includes(key)) {
      return {
        courseSlug: val.courseSlug || 'courses',
        courseTitle: val.courseTitle || 'Related Course',
        whyRequired: val.whyRequired || `Industry standard skill for ${title} required on production teams.`,
        prerequisites: val.prerequisites || 'Previous stage completion',
        difficulty: val.difficulty || 'intermediate',
        duration: val.duration || '2 weeks (~15 hours)',
      };
    }
  }

  // Fallbacks by broad domain keywords
  if (normalizedSlug.includes('data') || normalizedSlug.includes('anal') || normalizedSlug.includes('metric')) {
    return {
      courseSlug: 'data-analytics',
      courseTitle: 'Data Analytics Fundamentals',
      whyRequired: `Measure, analyze, and communicate data findings for ${title} to drive business decisions.`,
      prerequisites: 'Spreadsheet and math fundamentals',
      difficulty: 'intermediate',
      duration: '2 weeks (~15 hours)',
    };
  }

  if (normalizedSlug.includes('code') || normalizedSlug.includes('prog') || normalizedSlug.includes('script')) {
    return {
      courseSlug: 'python-programming',
      courseTitle: 'Python Programming',
      whyRequired: `Automate tasks and construct computational logic for ${title}.`,
      prerequisites: 'Logical reasoning fundamentals',
      difficulty: 'beginner',
      duration: '3 weeks (~20 hours)',
    };
  }

  // Default clean stage
  return {
    courseSlug: 'web-development',
    courseTitle: 'Career Fundamentals Course',
    whyRequired: `Foundational capability in ${title} that unlocks subsequent stages in your career journey.`,
    prerequisites: 'Prior roadmap phase completion',
    difficulty: 'beginner',
    duration: '2 weeks (~12 hours)',
  };
}
