/**
 * courseVideos.ts
 * Curated high-definition video service for course lessons.
 * Provides embedded video tutorials, channel credits, chapters, and key takeaways for all 12 courses.
 */

export interface VideoChapter {
  timeSeconds: number;
  timeLabel: string;
  title: string;
}

export interface CourseVideoData {
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  description: string;
  chapters: VideoChapter[];
  keyTakeaways: string[];
  alternativeVideos?: {
    youtubeId: string;
    title: string;
    channel: string;
    duration: string;
  }[];
}

export const DEFAULT_PYTHON_VIDEO: CourseVideoData = {
  youtubeId: 'kqtD5dpn9C8',
  title: 'Python Tutorial for Beginners - Full In-Depth Lecture',
  channel: 'Programming with Mosh',
  duration: '1 hr 00 min',
  description: 'Master core Python programming step by step with clear visual breakdowns and code examples.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Introduction & Python Setup' },
    { timeSeconds: 310, timeLabel: '05:10', title: 'Variables & Memory Model' },
    { timeSeconds: 780, timeLabel: '13:00', title: 'Receiving User Input & Type Conversions' },
    { timeSeconds: 1245, timeLabel: '20:45', title: 'Strings & Formatted Output' },
    { timeSeconds: 1830, timeLabel: '30:30', title: 'Operators & Arithmetic Precedence' },
    { timeSeconds: 2420, timeLabel: '40:20', title: 'Conditional If Statements & Logical Logic' },
    { timeSeconds: 3100, timeLabel: '51:40', title: 'Loops & Practical Problem Walkthrough' },
  ],
  keyTakeaways: [
    'How Python executes code line by line through the interpreter',
    'Best practices for naming variables and managing data types',
    'How to write clean, idiomatic Python adhering to PEP 8 standards',
    'Practical real-world debugging tips for common beginner syntax errors'
  ],
  alternativeVideos: [
    {
      youtubeId: 'rfscVS0vtbw',
      title: 'Python for Beginners - Full Comprehensive Course',
      channel: 'freeCodeCamp.org',
      duration: '4 hr 26 min'
    },
    {
      youtubeId: 'cQT33yu9pY8',
      title: 'Python Variables and Data Types Deep Dive',
      channel: 'Corey Schafer',
      duration: '12 min 30 sec'
    }
  ]
};

export const DEFAULT_SQL_VIDEO: CourseVideoData = {
  youtubeId: 'HXV3zeQKqGY',
  title: 'SQL Tutorial - Full Database Course for Beginners',
  channel: 'freeCodeCamp.org',
  duration: '4 hr 20 min',
  description: 'Learn SQL and relational database management systems from basic queries to multi-table joins and aggregation.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'What is a Database & Relational Schema' },
    { timeSeconds: 420, timeLabel: '07:00', title: 'Creating Tables, Keys & Constraints' },
    { timeSeconds: 1200, timeLabel: '20:00', title: 'Inserting and Updating Records' },
    { timeSeconds: 2100, timeLabel: '35:00', title: 'SELECT Queries, Filtering with WHERE' },
    { timeSeconds: 3600, timeLabel: '1:00:00', title: 'Aggregate Functions: COUNT, SUM, AVG' },
    { timeSeconds: 5400, timeLabel: '1:30:00', title: 'INNER, LEFT, RIGHT and FULL OUTER JOINs' },
  ],
  keyTakeaways: [
    'Relational database architecture, primary keys, and foreign key relationships',
    'Writing bulletproof SELECT queries with complex WHERE and HAVING conditions',
    'Optimizing table joins and understanding query execution order',
    'Preventing accidental data loss with transactions and rollback safeguards'
  ],
  alternativeVideos: [
    {
      youtubeId: '7S_tz1z_5bA',
      title: 'SQL Tutorial for Beginners (Complete Course)',
      channel: 'Programming with Mosh',
      duration: '1 hr 03 min'
    },
    {
      youtubeId: '9yeOJ0ZMUYw',
      title: 'SQL JOINs Explained Visually',
      channel: 'Alex The Analyst',
      duration: '14 min 20 sec'
    }
  ]
};

export const DEFAULT_ANALYTICS_VIDEO: CourseVideoData = {
  youtubeId: 'r-uOLxNrNk8',
  title: 'Data Analyst Portfolio Project & Workflow Walkthrough',
  channel: 'Alex The Analyst',
  duration: '1 hr 18 min',
  description: 'End-to-end data analytics workflow: data gathering, cleaning in Excel/Pandas, SQL exploration, and dashboard reporting.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Overview of the Analytics Workflow' },
    { timeSeconds: 450, timeLabel: '07:30', title: 'Data Extraction & Cleaning Foundations' },
    { timeSeconds: 1350, timeLabel: '22:30', title: 'Exploratory Analysis & Statistical Outliers' },
    { timeSeconds: 2400, timeLabel: '40:00', title: 'Aggregation & Pivot Metrics' },
    { timeSeconds: 3600, timeLabel: '1:00:00', title: 'Building Interactive Executive Dashboards' },
  ],
  keyTakeaways: [
    'How professional analysts separate raw transactional data from transformed metrics',
    'Standard data cleaning heuristics to eliminate nulls and invalid data types',
    'Designing visual stories that guide business stakeholder decisions'
  ],
  alternativeVideos: [
    {
      youtubeId: 'ua-CiDNNj30',
      title: 'Learn Data Analytics in 2024 - Complete Roadmap',
      channel: 'Ken Jee',
      duration: '22 min 10 sec'
    }
  ]
};

export const DEFAULT_WEB_VIDEO: CourseVideoData = {
  youtubeId: 'nu_pCVPKzTk',
  title: 'Full Stack Web Development for Beginners - HTML, CSS, JavaScript',
  channel: 'freeCodeCamp.org',
  duration: '11 hr 30 min',
  description: 'Complete hands-on modern web development bootcamp teaching responsive design, DOM manipulation, APIs, and modern frameworks.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'How the Web Works & HTTP Protocol' },
    { timeSeconds: 1800, timeLabel: '30:00', title: 'HTML5 Semantic Layouts' },
    { timeSeconds: 5400, timeLabel: '1:30:00', title: 'CSS3 Styling & Box Model' },
    { timeSeconds: 10800, timeLabel: '3:00:00', title: 'Responsive Flexbox & CSS Grid' },
    { timeSeconds: 18000, timeLabel: '5:00:00', title: 'JavaScript ES6+, DOM Events & Fetch API' },
  ],
  keyTakeaways: [
    'How browsers fetch, parse HTML, construct DOM trees, and render CSS layouts',
    'Modern responsive layouts using Flexbox and CSS Grid without media query bloat',
    'Connecting frontends to backend APIs using async/await and JSON data formats'
  ],
  alternativeVideos: [
    {
      youtubeId: 'bMknfKXIFA8',
      title: 'React.js Complete Course for Beginners',
      channel: 'freeCodeCamp.org',
      duration: '5 hr 12 min'
    }
  ]
};

// ─── 8 NEW COURSE VIDEO DATASETS ───────────────────────────────────────────

export const DEFAULT_DSA_VIDEO: CourseVideoData = {
  youtubeId: '8hly31xKLI0',
  title: 'Data Structures and Algorithms for Beginners - Full Course',
  channel: 'freeCodeCamp.org',
  duration: '8 hr 15 min',
  description: 'Master Big-O notation, linear structures (Arrays, Linked Lists, Stacks, Queues), Hash Tables, Trees, Graphs, and Dynamic Programming.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Introduction & Asymptotic Big-O Analysis' },
    { timeSeconds: 2700, timeLabel: '45:00', title: 'Arrays & Two-Pointer Strategies' },
    { timeSeconds: 5400, timeLabel: '1:30:00', title: 'Singly and Doubly Linked Lists' },
    { timeSeconds: 9000, timeLabel: '2:30:00', title: 'Stacks, Queues & Monotonic Patterns' },
    { timeSeconds: 12600, timeLabel: '3:30:00', title: 'Hash Tables & Collision Resolution' },
    { timeSeconds: 16200, timeLabel: '4:30:00', title: 'Binary Trees & Traversals (DFS/BFS)' },
    { timeSeconds: 21600, timeLabel: '6:00:00', title: 'Graphs, BFS, DFS & Dijkstra Algorithm' },
    { timeSeconds: 25200, timeLabel: '7:00:00', title: 'Dynamic Programming & Memoization' },
  ],
  keyTakeaways: [
    'Understanding asymptotic trade-offs between Time and Auxiliary Space complexity',
    'Choosing the optimal data structure based on read vs write frequencies',
    'Solving technical coding interview questions systematically using pattern recognition'
  ],
  alternativeVideos: [
    {
      youtubeId: 'BBpAmxU_NQo',
      title: 'NeetCode Roadmap - Core Data Structures',
      channel: 'NeetCode',
      duration: '1 hr 12 min'
    }
  ]
};

export const DEFAULT_GIT_VIDEO: CourseVideoData = {
  youtubeId: 'RGOj5yH7evk',
  title: 'Git and GitHub for Beginners - Crash Course',
  channel: 'freeCodeCamp.org',
  duration: '1 hr 08 min',
  description: 'Understand distributed version control: working directory, staging index, commit DAG trees, branches, merge conflicts, and GitHub pull requests.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Why Version Control Matters' },
    { timeSeconds: 420, timeLabel: '07:00', title: 'Git Architecture: Working Tree, Index & HEAD' },
    { timeSeconds: 1200, timeLabel: '20:00', title: 'git add, git commit & Semantic Commit Messages' },
    { timeSeconds: 2100, timeLabel: '35:00', title: 'Branching Workflows & Merging' },
    { timeSeconds: 2700, timeLabel: '45:00', title: 'Resolving Merge Conflicts Confidently' },
    { timeSeconds: 3300, timeLabel: '55:00', title: 'Pushing to GitHub & Opening Pull Requests' },
  ],
  keyTakeaways: [
    'How Git represents history as an immutable directed acyclic graph (DAG) of commit snapshots',
    'Safe branching workflows that isolate feature developments from production',
    'Handling and resolving merge conflicts step-by-step without losing work'
  ],
  alternativeVideos: [
    {
      youtubeId: 'DVRQoVRzMIY',
      title: 'Git Tutorial for Beginners: Command-line Mastery',
      channel: 'Programming with Mosh',
      duration: '1 hr 09 min'
    }
  ]
};

export const DEFAULT_CLOUD_VIDEO: CourseVideoData = {
  youtubeId: 'SOTamWNgDKc',
  title: 'AWS Certified Cloud Practitioner - Complete Cloud Bootcamp',
  channel: 'freeCodeCamp.org',
  duration: '13 hr 50 min',
  description: 'Learn cloud computing architecture, IaaS/PaaS/SaaS models, virtual private clouds (VPC), EC2 compute, S3 object storage, and IAM security.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Cloud Computing Fundamentals & Value Proposition' },
    { timeSeconds: 3600, timeLabel: '1:00:00', title: 'Global Cloud Infrastructure: Regions & AZs' },
    { timeSeconds: 7200, timeLabel: '2:00:00', title: 'IAM: Users, Groups, Roles & Policies' },
    { timeSeconds: 14400, timeLabel: '4:00:00', title: 'Compute Services: EC2, Lambda & Elastic Beanstalk' },
    { timeSeconds: 21600, timeLabel: '6:00:00', title: 'Cloud Storage: S3, EBS & Glacier Lifecycle' },
    { timeSeconds: 28800, timeLabel: '8:00:00', title: 'Networking: VPCs, Subnets, Gateways & Security Groups' },
  ],
  keyTakeaways: [
    'The Shared Responsibility Model between cloud provider and customer',
    'Designing highly available multi-region and multi-AZ fault-tolerant topologies',
    'Enforcing least privilege access control with IAM policies'
  ],
  alternativeVideos: [
    {
      youtubeId: '2LaAJq1lB1Q',
      title: 'Cloud Computing in 10 Minutes',
      channel: 'Simplilearn',
      duration: '10 min 20 sec'
    }
  ]
};

export const DEFAULT_LINUX_VIDEO: CourseVideoData = {
  youtubeId: 'sWbANNj4j_0',
  title: 'Linux for Beginners - Full In-Depth Course',
  channel: 'freeCodeCamp.org',
  duration: '5 hr 50 min',
  description: 'Master the Linux terminal, filesystem hierarchy, POSIX permissions, user/group management, process signals, systemd, and server administration.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Linux Kernel & Distribution Ecosystem' },
    { timeSeconds: 1800, timeLabel: '30:00', title: 'Filesystem Hierarchy: /etc, /var, /usr' },
    { timeSeconds: 5400, timeLabel: '1:30:00', title: 'Pipes, Redirections & Text Processing (grep, awk, sed)' },
    { timeSeconds: 9000, timeLabel: '2:30:00', title: 'File Permissions (chmod, chown, octal bits)' },
    { timeSeconds: 12600, timeLabel: '3:30:00', title: 'Process Management: ps, top, kill, systemctl' },
    { timeSeconds: 16200, timeLabel: '4:30:00', title: 'Bash Shell Scripting & Automation' },
  ],
  keyTakeaways: [
    'Everything in Linux is represented as a file or stream',
    'Managing process lifecycles and background services using systemd',
    'Securing remote SSH servers with public key authentication and firewall rules'
  ],
  alternativeVideos: [
    {
      youtubeId: 'V1y-mbWM3B8',
      title: 'You need to learn Linux RIGHT NOW!',
      channel: 'NetworkChuck',
      duration: '18 min 45 sec'
    }
  ]
};

export const DEFAULT_DEVOPS_VIDEO: CourseVideoData = {
  youtubeId: 'j5Zsa_eOXeY',
  title: 'DevOps Course for Beginners - Docker, Kubernetes, CI/CD',
  channel: 'freeCodeCamp.org',
  duration: '2 hr 15 min',
  description: 'Understand DevOps culture, continuous delivery lifecycles, Docker containerization, Kubernetes cluster orchestration, and infrastructure automation.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'What is DevOps & Engineering Velocity' },
    { timeSeconds: 1200, timeLabel: '20:00', title: 'CI/CD Pipelines: Automating Build & Test Gates' },
    { timeSeconds: 2700, timeLabel: '45:00', title: 'Docker: Images, Containers & Multi-Stage Builds' },
    { timeSeconds: 4500, timeLabel: '1:15:00', title: 'Kubernetes: Pods, Deployments, Services & Ingress' },
    { timeSeconds: 6300, timeLabel: '1:45:00', title: 'Infrastructure as Code (Terraform) & Observability' },
  ],
  keyTakeaways: [
    'Eliminating operational silos through automated continuous deployment pipelines',
    'Package once, run anywhere consistency with lightweight Docker images',
    'Self-healing and auto-scaling container fleets using Kubernetes declarations'
  ],
  alternativeVideos: [
    {
      youtubeId: '9pZ2xmsSDdo',
      title: 'DevOps Roadmap & Core Skills Walkthrough',
      channel: 'TechWorld with Nana',
      duration: '24 min 30 sec'
    }
  ]
};

export const DEFAULT_CYBERSECURITY_VIDEO: CourseVideoData = {
  youtubeId: 'U_P23SqJaDc',
  title: 'Cybersecurity for Beginners - Full Crash Course',
  channel: 'freeCodeCamp.org',
  duration: '1 hr 55 min',
  description: 'Understand the CIA Triad, threat modeling, malware vectors, cryptography (symmetric/asymmetric), OWASP Top 10 vulnerabilities, and SOC incident response.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'The CIA Security Triad & Threat Landscapes' },
    { timeSeconds: 900, timeLabel: '15:00', title: 'Common Attack Vectors: Phishing, Ransomware, Man-in-the-Middle' },
    { timeSeconds: 2400, timeLabel: '40:00', title: 'Cryptography: Hashing, Symmetric AES & Public Key RSA' },
    { timeSeconds: 3900, timeLabel: '1:05:00', title: 'Web App Security: SQL Injection & Cross-Site Scripting (XSS)' },
    { timeSeconds: 5400, timeLabel: '1:30:00', title: 'SOC Operations, SIEM Monitoring & Incident Remediation' },
  ],
  keyTakeaways: [
    'Balancing security measures against system usability and business velocity',
    'Treating untrusted user input with zero trust via parameterized queries and sanitization',
    'Detecting, isolating, and reporting security incidents before systemic compromise'
  ],
  alternativeVideos: [
    {
      youtubeId: 'inWWhr5tnEA',
      title: 'How Hackers Exploit Networks',
      channel: 'NetworkChuck',
      duration: '16 min 10 sec'
    }
  ]
};

export const DEFAULT_SOFTWARE_ENGINEERING_VIDEO: CourseVideoData = {
  youtubeId: 'ZgdS0EUmn70',
  title: 'Software Engineering Principles & System Design Bootcamp',
  channel: 'freeCodeCamp.org',
  duration: '3 hr 45 min',
  description: 'Master SDLC phases, Agile/Scrum ceremonies, Robert C. Martin SOLID principles, design patterns, microservices architecture, and automated testing.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'The Software Development Lifecycle (SDLC)' },
    { timeSeconds: 1800, timeLabel: '30:00', title: 'Agile & Scrum: Sprints, Epics, Stories & Retrospectives' },
    { timeSeconds: 4500, timeLabel: '1:15:00', title: 'The SOLID Principles with Real Code Walkthroughs' },
    { timeSeconds: 8100, timeLabel: '2:15:00', title: 'Design Patterns: Factory, Singleton, Strategy, Observer' },
    { timeSeconds: 10800, timeLabel: '3:00:00', title: 'Automated Testing: Unit, Integration & End-to-End' },
  ],
  keyTakeaways: [
    'Writing maintainable code that is easy to extend without altering existing tested modules',
    'Managing technical debt and communicating architectural decisions clearly',
    'Structuring Agile sprints to deliver incremental working value continuously'
  ],
  alternativeVideos: [
    {
      youtubeId: 'M3_p2wZ5F1E',
      title: 'System Design for Beginners',
      channel: 'Gaurav Sen',
      duration: '19 min 40 sec'
    }
  ]
};

export const DEFAULT_MOBILE_VIDEO: CourseVideoData = {
  youtubeId: '0-S5a0eXPoc',
  title: 'React Native Full Course 2024 - Cross-Platform Mobile Development',
  channel: 'freeCodeCamp.org',
  duration: '5 hr 30 min',
  description: 'Build native iOS and Android apps using React Native. Covers flexbox mobile layouts, touch gestures, navigation stacks, offline persistence, and deployment.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Mobile App Architecture & Native Bridges' },
    { timeSeconds: 2400, timeLabel: '40:00', title: 'Mobile Layouts with Flexbox & Safe Area Views' },
    { timeSeconds: 6000, timeLabel: '1:40:00', title: 'Touch Handlers, ScrollView & FlatList Optimization' },
    { timeSeconds: 10800, timeLabel: '3:00:00', title: 'Navigation Stacks & Bottom Tab Navigators' },
    { timeSeconds: 14400, timeLabel: '4:00:00', title: 'Offline Storage, REST APIs & App Store Preparation' },
  ],
  keyTakeaways: [
    'Understanding mobile lifecycle constraints and aggressive OS memory reclamation',
    'Optimizing long lists using FlatList windowing to prevent UI stutter',
    'Creating offline-first user experiences with local storage caching'
  ],
  alternativeVideos: [
    {
      youtubeId: 'VozPNrt-LfE',
      title: 'React Native Tutorial for Beginners',
      channel: 'Programming with Mosh',
      duration: '2 hr 02 min'
    }
  ]
};

// ─── HELPER DISPATCHER ──────────────────────────────────────────────────────

export function getCourseVideoData(courseSlug: string = '', lessonTitle: string = ''): CourseVideoData {
  const slug = courseSlug.toLowerCase();
  const normTitle = lessonTitle.toLowerCase();

  // 1. Data Structures & Algorithms
  if (slug.includes('structures') || slug.includes('algorithm') || slug.includes('dsa')) {
    return DEFAULT_DSA_VIDEO;
  }

  // 2. Git & GitHub
  if (slug.includes('git')) {
    return DEFAULT_GIT_VIDEO;
  }

  // 3. Cloud Computing
  if (slug.includes('cloud') || slug.includes('aws') || slug.includes('azure')) {
    return DEFAULT_CLOUD_VIDEO;
  }

  // 4. Linux & Systems
  if (slug.includes('linux') || slug.includes('system-admin')) {
    return DEFAULT_LINUX_VIDEO;
  }

  // 5. DevOps
  if (slug.includes('devops') || slug.includes('docker') || slug.includes('kubernetes')) {
    return DEFAULT_DEVOPS_VIDEO;
  }

  // 6. Cybersecurity
  if (slug.includes('security') || slug.includes('cyber')) {
    return DEFAULT_CYBERSECURITY_VIDEO;
  }

  // 7. Software Engineering
  if (slug.includes('software-engineering') || slug.includes('system-design')) {
    return DEFAULT_SOFTWARE_ENGINEERING_VIDEO;
  }

  // 8. Mobile Development
  if (slug.includes('mobile') || slug.includes('android') || slug.includes('react-native') || slug.includes('ios')) {
    return DEFAULT_MOBILE_VIDEO;
  }

  // 9. Python
  if (slug.includes('python')) {
    return DEFAULT_PYTHON_VIDEO;
  }

  // 10. SQL & Databases
  if (slug.includes('sql') || slug.includes('database')) {
    return DEFAULT_SQL_VIDEO;
  }

  // 11. Web Development
  if (slug.includes('web') || slug.includes('react') || slug.includes('js')) {
    return DEFAULT_WEB_VIDEO;
  }

  // 12. Data Analytics
  if (slug.includes('analytics') || slug.includes('data')) {
    return DEFAULT_ANALYTICS_VIDEO;
  }

  // Default fallback
  return DEFAULT_PYTHON_VIDEO;
}

export const getLessonVideoData = getCourseVideoData;

