export interface CareerLadderStep {
  level: string;
  title: string;
  experience: string;
  description: string;
  typicalSalary: string;
}

export interface CareerSalary {
  entry: string;
  mid: string;
  senior: string;
  currency: string;
  note: string;
}

export interface RelatedCareerRef {
  title: string;
  slug: string;
  reason: string;
}

export interface CareerProfile {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  whatTheyDo: string;
  responsibilities: string[];
  workplaces: string[];
  industries: string[];
  educationBackground: string[];
  technicalSkills: string[];
  softSkills: string[];
  toolsAndTechnologies: string[];
  entryLevelRoles: string[];
  careerProgression: CareerLadderStep[];
  salaryRange: CareerSalary;
  opportunities: string;
  prerequisites: string[];
  suitableFor: string[];
  relatedCareers: RelatedCareerRef[];
  recommendedCourseSlug?: string;
  roadmapSequence: Array<{
    step: number;
    title: string;
    skillSlug: string;
    whyRequired: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    courseSlug?: string;
  }>;
}

export const CAREER_PROFILES: Record<string, CareerProfile> = {
  'data-analyst': {
    slug: 'data-analyst',
    title: 'Data Analyst',
    tagline: 'Transform raw business data into actionable visual insights and strategic decisions.',
    overview: 'A Data Analyst examines complex datasets to identify trends, patterns, and anomalies. They bridge the gap between raw data and business stakeholders, crafting reports, automated dashboards, and analytical models that drive executive decisions.',
    whatTheyDo: 'Data Analysts collect data from databases and APIs, clean and validate messy datasets, perform statistical explorations, build interactive dashboards (like Tableau and Power BI), and present actionable findings to management to improve revenue, customer retention, and operations.',
    responsibilities: [
      'Extract data using complex SQL queries from relational and cloud data warehouses.',
      'Clean, normalize, and manipulate unstructured datasets with Python, Pandas, or Excel.',
      'Build and maintain executive-facing dashboards in Power BI, Tableau, or Metabase.',
      'Perform exploratory data analysis (EDA) and identify operational bottlenecks and growth trends.',
      'Collaborate with product and marketing managers to define key performance indicators (KPIs).',
      'Present analytical findings through data storytelling to non-technical business leaders.'
    ],
    workplaces: [
      'Technology companies & fast-growing startups',
      'Financial institutions, investment banks, and FinTechs',
      'Healthcare networks and biomedical providers',
      'E-commerce giants and digital retail chains',
      'Management and IT strategy consultancies',
      'Remote-first global distributed teams'
    ],
    industries: [
      'FinTech & Banking',
      'E-Commerce & Retail',
      'Healthcare & Pharma',
      'SaaS & Digital Technology',
      'Logistics & Supply Chain',
      'Entertainment & Streaming'
    ],
    educationBackground: [
      "Bachelor's degree in Computer Science, Statistics, Mathematics, Economics, Business Analytics, or Engineering.",
      'Equivalent demonstrable experience with hands-on portfolio projects and certifications (Google Data Analytics, Microsoft Power BI).'
    ],
    technicalSkills: [
      'SQL Querying & Database Management',
      'Python (Pandas, NumPy, Matplotlib)',
      'Advanced Microsoft Excel (VLOOKUP, Pivot Tables, Power Query)',
      'Data Visualization & Business Intelligence (Power BI / Tableau)',
      'Applied Descriptive & Inferential Statistics',
      'Data Cleaning, Wrangling & ETL Concepts'
    ],
    softSkills: [
      'Analytical & Critical Thinking',
      'Data Storytelling & Executive Presentation',
      'Problem Solving & Root Cause Analysis',
      'Cross-functional Collaboration',
      'Meticulous Attention to Detail'
    ],
    toolsAndTechnologies: [
      'SQL (PostgreSQL, MySQL, Snowflake)',
      'Python (Jupyter Notebook, Pandas, Seaborn)',
      'Power BI, Tableau, Google Looker Studio',
      'Excel & Google Sheets',
      'Git & GitHub'
    ],
    entryLevelRoles: [
      'Junior Data Analyst',
      'Business Intelligence (BI) Trainee',
      'Data Operations Specialist',
      'Reporting Analyst'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Data Analyst',
        experience: '0 - 2 Years',
        description: 'Focuses on querying databases, building baseline reports, maintaining automated sheets, and validating data pipelines.',
        typicalSalary: '₹4.5L - ₹8L / $65,000 - $85,000'
      },
      {
        level: 'Mid-Level',
        title: 'Senior Data Analyst',
        experience: '2 - 5 Years',
        description: 'Owns end-to-end analytics initiatives, designs warehouse schemas, leads predictive analysis, and mentors junior analysts.',
        typicalSalary: '₹9L - ₹18L / $90,000 - $125,000'
      },
      {
        level: 'Lead / Principal',
        title: 'Lead Analytics Specialist / BI Lead',
        experience: '5 - 8 Years',
        description: 'Architects enterprise BI systems, aligns data roadmap with quarterly business OKRs, and drives company-wide data culture.',
        typicalSalary: '₹18L - ₹32L / $130,000 - $175,000'
      },
      {
        level: 'Executive',
        title: 'Director of Analytics / Head of Data',
        experience: '8+ Years',
        description: 'Oversees the entire data ecosystem across engineering, science, and analytics, reporting directly to VP or C-suite.',
        typicalSalary: '₹35L - ₹60L+ / $180,000 - $250,000+'
      }
    ],
    salaryRange: {
      entry: '₹4.5L - ₹8L ($65,000 - $85,000)',
      mid: '₹9L - ₹18L ($90,000 - $125,000)',
      senior: '₹20L - ₹38L ($135,000 - $185,000)',
      currency: 'INR / USD',
      note: 'Compensation varies based on geography, industry (e.g. FinTech and US tech pay highest), and tool proficiency.'
    },
    opportunities: 'Projected 25% employment growth through 2032 (much faster than average). Every modern enterprise relies on data-driven decision-making, ensuring perpetual demand across both tech and traditional sectors.',
    prerequisites: [
      'High school / university level basic algebra and arithmetic',
      'Curiosity for numbers, trends, and business problems',
      'Comfort using spreadsheets and computers'
    ],
    suitableFor: [
      'Curious thinkers who enjoy finding hidden stories behind numbers',
      'Organized problem-solvers who like structured workflows',
      'Communicators who want to influence business strategy without writing 1,000 lines of low-level code'
    ],
    relatedCareers: [
      { title: 'Data Scientist', slug: 'data-scientist', reason: 'Deeper emphasis on predictive machine learning and mathematics.' },
      { title: 'Business Analyst', slug: 'business-analyst', reason: 'Focuses heavily on business processes, requirements, and stakeholder workflows.' },
      { title: 'Financial Analyst', slug: 'financial-analyst', reason: 'Specialized in fiscal modeling, forecasting, and investment analysis.' }
    ],
    recommendedCourseSlug: 'data-analytics',
    roadmapSequence: [
      { step: 1, title: 'Computer & Data Fundamentals', skillSlug: 'computer-fundamentals', whyRequired: 'Understand how computers process, store, and organize digital data.', duration: '1 week (10 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 2, title: 'Advanced Excel & Spreadsheets', skillSlug: 'excel', whyRequired: 'The universal language of business data manipulation and fast ad-hoc checks.', duration: '2 weeks (20 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 3, title: 'Applied Business Statistics', skillSlug: 'statistics', whyRequired: 'Evaluate significance, distributions, variance, and avoid misleading conclusions.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 4, title: 'SQL & Relational Databases', skillSlug: 'sql', whyRequired: 'Extract, join, and aggregate transactional business data from production databases.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 5, title: 'Python Programming Essentials', skillSlug: 'python', whyRequired: 'Automate repetitive workflows and manipulate complex data beyond Excel limits.', duration: '3 weeks (30 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 6, title: 'Data Wrangling with Pandas & NumPy', skillSlug: 'pandas', whyRequired: 'Clean messy data, handle missing values, and transform complex tables efficiently.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 7, title: 'Data Visualization & BI (Power BI / Tableau)', skillSlug: 'data-visualization', whyRequired: 'Build high-impact executive dashboards that communicate actionable insights.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 8, title: 'Real-World Capstone Projects & Portfolio', skillSlug: 'portfolio-projects', whyRequired: 'Prove your ability to solve real business challenges with public code and reports.', duration: '3 weeks (30 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' }
    ]
  },

  'software-developer': {
    slug: 'software-developer',
    title: 'Software Developer',
    tagline: 'Design, write, test, and ship modern software applications and digital platforms.',
    overview: 'A Software Developer writes clean, maintainable code to create web, mobile, and desktop applications. They transform product requirements into robust software architectures, collaborate across engineering squads, and ensure applications scale reliably to millions of users.',
    whatTheyDo: 'Software Developers break down user needs into technical specifications, write backend APIs or frontend user interfaces, design database models, write automated tests, review teammates’ code, and debug production issues in real time.',
    responsibilities: [
      'Write clean, modular, and performant code in languages like Python, JavaScript, Java, or Go.',
      'Develop scalable RESTful and GraphQL APIs for client applications.',
      'Design and optimize relational and document database schemas.',
      'Implement unit, integration, and end-to-end automated testing suites.',
      'Collaborate via Git, code reviews, and Agile/Scrum sprint ceremonies.',
      'Monitor and troubleshoot bugs, security vulnerabilities, and latency bottlenecks.'
    ],
    workplaces: [
      'Global software enterprises (Google, Microsoft, Amazon, Meta)',
      'High-growth tech startups and scale-ups',
      'Fintech and digital banking development hubs',
      'Digital agencies and software consultancies',
      'Fully remote open-source and global software shops'
    ],
    industries: [
      'Enterprise SaaS',
      'Consumer Internet & Mobile Apps',
      'FinTech & Decentralized Systems',
      'Healthcare & Telemedicine',
      'E-Commerce & Marketplaces',
      'Gaming & Interactive Entertainment'
    ],
    educationBackground: [
      "Bachelor's degree in Computer Science, Software Engineering, Information Technology, or related discipline.",
      'Or self-taught / coding bootcamp graduate with a strong GitHub portfolio of deployed applications.'
    ],
    technicalSkills: [
      'Programming Languages (Python, JavaScript/TypeScript, Java, Go)',
      'Data Structures & Algorithms (Arrays, Hash Maps, Trees, Graphs)',
      'Frontend Frameworks (React, Vue, or Next.js)',
      'Backend Frameworks (FastAPI, Express.js, Django, Spring Boot)',
      'Relational & NoSQL Databases (PostgreSQL, MongoDB)',
      'Version Control (Git/GitHub) & CI/CD Pipelines'
    ],
    softSkills: [
      'Algorithmic Problem-Solving & Logical Reasoning',
      'Code Readability & Documentation Habits',
      'Constructive Team Communication & Peer Code Reviews',
      'Continuous Curiosity and Fast Learning Speed'
    ],
    toolsAndTechnologies: [
      'VS Code, JetBrains IDEs',
      'Git, GitHub, GitLab',
      'Docker, Postman, Linux Terminal',
      'PostgreSQL, Redis, SQLite',
      'Vercel, AWS, Node.js'
    ],
    entryLevelRoles: [
      'Junior Software Engineer',
      'Associate Application Developer',
      'Junior Full Stack Developer',
      'Frontend / Backend Trainee'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Software Engineer',
        experience: '0 - 2 Years',
        description: 'Implements assigned features, fixes bugs, writes tests, and learns codebase standards under senior guidance.',
        typicalSalary: '₹5L - ₹10L / $75,000 - $105,000'
      },
      {
        level: 'Mid-Level',
        title: 'Software Engineer II',
        experience: '2 - 5 Years',
        description: 'Owns end-to-end modules, designs microservices, reviews pull requests, and contributes to system architecture.',
        typicalSalary: '₹12L - ₹24L / $110,000 - $155,000'
      },
      {
        level: 'Senior',
        title: 'Senior Software Engineer',
        experience: '5 - 8 Years',
        description: 'Designs large-scale distributed architectures, solves performance bottlenecks, and mentors junior & mid engineers.',
        typicalSalary: '₹25L - ₹45L / $155,000 - $210,000'
      },
      {
        level: 'Staff / Architect',
        title: 'Staff Engineer / Principal Architect',
        experience: '8+ Years',
        description: 'Sets technological direction for entire departments, guides multi-team engineering roadmaps, and solves hardest systemic challenges.',
        typicalSalary: '₹45L - ₹85L+ / $215,000 - $320,000+'
      }
    ],
    salaryRange: {
      entry: '₹5L - ₹10L ($75,000 - $105,000)',
      mid: '₹12L - ₹24L ($110,000 - $155,000)',
      senior: '₹25L - ₹50L ($160,000 - $230,000)',
      currency: 'INR / USD',
      note: 'Top tech firms, US tech remote employers, and specialized domain expertise offer significant equity and bonuses.'
    },
    opportunities: 'Software is eating the world. Projected 26% growth rate over the next decade. Every industry requires custom software, mobile experiences, and automation services.',
    prerequisites: [
      'Basic familiarity with computer operating systems and terminal basics',
      'Logical reasoning and desire to build creative digital products',
      'Willingness to iterate and debug through errors patiently'
    ],
    suitableFor: [
      'Builders who love turning an idea in their head into a working product on screen',
      'Analytical thinkers who find satisfaction in solving puzzles and algorithms',
      'Lifelong learners who stay excited about emerging frameworks and technologies'
    ],
    relatedCareers: [
      { title: 'DevOps Engineer', slug: 'devops-engineer', reason: 'Focuses on the deployment, infrastructure, and automation pipelines of software.' },
      { title: 'Cloud Engineer', slug: 'cloud-engineer', reason: 'Specializes in hosting and scaling systems on AWS, GCP, or Azure.' },
      { title: 'ML Engineer', slug: 'ml-engineer', reason: 'Bridges software engineering with artificial intelligence algorithms.' }
    ],
    recommendedCourseSlug: 'python-programming',
    roadmapSequence: [
      { step: 1, title: 'Programming Fundamentals (Python / JS)', skillSlug: 'python', whyRequired: 'Master variables, loops, data structures, and algorithmic logic.', duration: '3 weeks (30 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Version Control with Git & GitHub', skillSlug: 'git', whyRequired: 'Collaborate with teams, track revisions, and manage production codebases.', duration: '1 week (10 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 3, title: 'Web Development Basics (HTML, CSS, JS)', skillSlug: 'web-development', whyRequired: 'Understand how browsers render UI, handle user input, and display information.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 4, title: 'SQL & Database Architecture', skillSlug: 'sql', whyRequired: 'Persist application data safely and write performant queries for backend services.', duration: '2 weeks (20 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 5, title: 'Backend Frameworks & REST APIs', skillSlug: 'backend-apis', whyRequired: 'Construct servers that handle authentication, business logic, and database transactions.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 6, title: 'Modern Frontend Development (React)', skillSlug: 'react', whyRequired: 'Create reactive, dynamic single-page web applications with reusable component architecture.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 7, title: 'Testing, Debugging & CI/CD', skillSlug: 'testing', whyRequired: 'Ensure production reliability through automated unit tests and continuous deployment.', duration: '2 weeks (15 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 8, title: 'Full Stack Capstone Projects & Deployments', skillSlug: 'capstone-project', whyRequired: 'Build, dockerize, and deploy full-stack applications to cloud platforms for your portfolio.', duration: '3 weeks (30 hrs)', difficulty: 'advanced', courseSlug: 'web-development' }
    ]
  },

  'cloud-engineer': {
    slug: 'cloud-engineer',
    title: 'Cloud Engineer',
    tagline: 'Architect, deploy, and manage highly reliable, scalable cloud infrastructures.',
    overview: 'A Cloud Engineer designs, deploys, and maintains multi-tenant cloud environments on AWS, Microsoft Azure, or Google Cloud Platform. They ensure high availability, fault tolerance, data security, and cost efficiency for modern internet-scale services.',
    whatTheyDo: 'Cloud Engineers build cloud network topologies (VPCs, subnets, route tables), provision compute resources (VMs, serverless containers), automate infrastructure deployments using code (Terraform), and secure organizational assets against outages and breaches.',
    responsibilities: [
      'Design and deploy scalable architectures on AWS, Azure, or GCP.',
      'Write Infrastructure as Code (IaC) using Terraform, CloudFormation, or Ansible.',
      'Configure cloud networking: VPCs, subnets, security groups, load balancers, and CDN.',
      'Manage containerized workloads using Docker and Kubernetes clusters.',
      'Implement cloud security standards, IAM role policies, and encryption at rest/transit.',
      'Optimize monthly cloud expenditure and analyze billing telemetry across departments.'
    ],
    workplaces: [
      'Cloud service providers & IT managed services firms',
      'Modern enterprise corporations transitioning from on-premises to cloud',
      'Fast-paced FinTech, HealthTech, and E-Commerce SaaS businesses',
      'Consulting firms helping enterprises modernize their digital infrastructure'
    ],
    industries: [
      'Cloud & IT Services',
      'Financial Services & FinTech',
      'Healthcare & Life Sciences',
      'Telecom & Networking',
      'Government & Defense Tech'
    ],
    educationBackground: [
      "Bachelor's in Computer Science, Information Systems, Electrical Engineering, or related field.",
      'Cloud certifications (AWS Solutions Architect, Azure Administrator, GCP Cloud Engineer) carry strong industry weight.'
    ],
    technicalSkills: [
      'Cloud Platforms (AWS, Azure, GCP)',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'Linux System Administration & Shell Scripting (Bash)',
      'Networking Fundamentals (TCP/IP, DNS, VPNs, CIDR)',
      'Containerization & Orchestration (Docker, Kubernetes)',
      'Cloud Security & IAM Governance'
    ],
    softSkills: [
      'Systemic Problem Decomposition',
      'Crisis Management & Incident Response Under Pressure',
      'Cross-Team Collaboration with Developers and SecOps',
      'Discipline in Cost Management & Resource Auditing'
    ],
    toolsAndTechnologies: [
      'AWS (EC2, S3, RDS, Lambda, VPC, IAM)',
      'Terraform, Ansible, Packer',
      'Docker, Kubernetes, Helm',
      'Linux (Ubuntu, Red Hat), Bash',
      'Prometheus, Grafana, CloudWatch'
    ],
    entryLevelRoles: [
      'Junior Cloud Administrator',
      'Cloud Support Engineer',
      'Associate Infrastructure Engineer',
      'Systems Operations Associate'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Cloud Support Engineer / Jr Cloud Admin',
        experience: '0 - 2 Years',
        description: 'Handles day-to-day cloud provisioning, ticket resolution, IAM access requests, and basic alerting.',
        typicalSalary: '₹5L - ₹9L / $70,000 - $95,000'
      },
      {
        level: 'Mid-Level',
        title: 'Cloud Engineer / Cloud Infrastructure Specialist',
        experience: '2 - 5 Years',
        description: 'Builds automated Terraform modules, provisions VPC networks, migrates workloads, and optimizes resource budgets.',
        typicalSalary: '₹11L - ₹22L / $105,000 - $145,000'
      },
      {
        level: 'Senior',
        title: 'Senior Cloud Architect',
        experience: '5 - 8 Years',
        description: 'Designs multi-region disaster recovery setups, microservice clusters, and company-wide compliance governance.',
        typicalSalary: '₹24L - ₹42L / $150,000 - $195,000'
      },
      {
        level: 'Executive',
        title: 'Chief Cloud Architect / VP of Infrastructure',
        experience: '8+ Years',
        description: 'Shapes enterprise cloud strategy, vendor negotiations with AWS/Microsoft, and digital transformation roadmaps.',
        typicalSalary: '₹40L - ₹75L+ / $200,000 - $280,000+'
      }
    ],
    salaryRange: {
      entry: '₹5L - ₹9L ($70,000 - $95,000)',
      mid: '₹11L - ₹22L ($105,000 - $145,000)',
      senior: '₹24L - ₹45L ($150,000 - $205,000)',
      currency: 'INR / USD',
      note: 'Certified AWS Solutions Architects and Kubernetes (CKA) professionals earn top-tier market compensation.'
    },
    opportunities: 'Nearly 90% of global organizations have adopted multi-cloud strategies. High demand continues for professionals who can build resilient, automated cloud infrastructure.',
    prerequisites: [
      'Basic knowledge of computer networks (IP addresses, client-server model)',
      'Basic familiarity with command-line interfaces and operating systems'
    ],
    suitableFor: [
      'Engineers who enjoy operating systems, networking, and server architecture',
      'Those fascinated by high-availability systems that serve millions of simultaneous requests',
      'Problem-solvers who prefer infrastructure automation over building frontend visuals'
    ],
    relatedCareers: [
      { title: 'DevOps Engineer', slug: 'devops-engineer', reason: 'Focuses heavily on continuous delivery pipelines and developer enablement.' },
      { title: 'Cybersecurity Analyst', slug: 'cybersecurity-analyst', reason: 'Specializes in defending cloud and enterprise assets from adversarial threats.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Writes the application logic that runs inside cloud containers.' }
    ],
    recommendedCourseSlug: 'python-programming',
    roadmapSequence: [
      { step: 1, title: 'Linux & Shell Scripting Foundations', skillSlug: 'linux', whyRequired: 'All production cloud servers run Linux distributions controlled via command lines.', duration: '2 weeks (15 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Networking Fundamentals (TCP/IP & DNS)', skillSlug: 'networking', whyRequired: 'Essential for configuring VPCs, subnets, routers, firewalls, and internet gateways.', duration: '2 weeks (15 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 3, title: 'Python for Cloud Automation', skillSlug: 'python', whyRequired: 'Script cloud APIs, automate server backups, and manage cloud event triggers.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 4, title: 'Core AWS / Azure Cloud Services', skillSlug: 'cloud-computing', whyRequired: 'Master compute (EC2/VMs), storage (S3/Blob), and managed databases (RDS).', duration: '3 weeks (30 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 5, title: 'Containers with Docker', skillSlug: 'docker', whyRequired: 'Package applications and runtime environments into lightweight portable images.', duration: '2 weeks (18 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 6, title: 'Infrastructure as Code (Terraform)', skillSlug: 'terraform', whyRequired: 'Declare and spin up entire cloud infrastructures reproducibly from code files.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 7, title: 'Kubernetes Orchestration & Monitoring', skillSlug: 'kubernetes', whyRequired: 'Deploy and auto-scale containerized microservice fleets with health monitoring.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'python-programming' }
    ]
  },

  'cybersecurity-analyst': {
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    tagline: 'Defend organizational networks, systems, and data from cyber threats and intrusions.',
    overview: 'A Cybersecurity Analyst monitors, protects, and defends digital networks and sensitive systems from unauthorized access, ransomware, data leaks, and cyberattacks. They conduct threat analysis, vulnerability scans, and disaster response operations.',
    whatTheyDo: 'Cybersecurity Analysts configure Security Information and Event Management (SIEM) systems, investigate anomalous network traffic, run penetration tests, enforce encryption policies, and respond swiftly to security breaches to minimize operational harm.',
    responsibilities: [
      'Monitor enterprise networks 24/7 for suspicious activities and intrusion attempts using SIEM tools.',
      'Investigate security alerts, triage incidents, and isolate compromised endpoints.',
      'Perform vulnerability assessments, network scans, and patch compliance audits.',
      'Implement multi-factor authentication (MFA), firewall rules, and zero-trust policies.',
      'Create and rehearse incident response plans and disaster recovery protocols.',
      'Educate company employees on phishing awareness and social engineering risks.'
    ],
    workplaces: [
      'Security Operations Centers (SOC) in defense & financial firms',
      'Government agencies and national critical infrastructure providers',
      'Managed Security Service Providers (MSSPs)',
      'Enterprise corporations and multinational consultancies'
    ],
    industries: [
      'Banking & Financial Services',
      'Defense, Government & Intelligence',
      'Healthcare Systems & Medical Tech',
      'Critical Infrastructure & Energy',
      'Technology & SaaS Providers'
    ],
    educationBackground: [
      "Bachelor's in Cybersecurity, Computer Science, Information Assurance, or Network Engineering.",
      'Industry certifications (CompTIA Security+, CEH, CISSP, CySA+) are highly valued by recruiters.'
    ],
    technicalSkills: [
      'Network Security (Firewalls, IDS/IPS, VPNs, Packet Analysis)',
      'Threat Detection & SIEM Tools (Splunk, Microsoft Sentinel, Wireshark)',
      'Vulnerability Management & Scanning (Nessus, Nmap)',
      'Operating System Internals (Windows Security, Linux Hardening)',
      'Scripting for Security Automation (Python, Bash, PowerShell)',
      'Cryptography & Public Key Infrastructure (PKI)'
    ],
    softSkills: [
      'Calm Decision-Making Under Critical Pressure',
      'Investigative Mindset & Attention to Subtleties',
      'Ethical Integrity & Strict Confidentiality',
      'Clear Technical Incident Reporting to Executives'
    ],
    toolsAndTechnologies: [
      'Wireshark, Nmap, Metasploit, Burp Suite',
      'Splunk, Elastic SIEM, CrowdStrike Falcon',
      'Python, Bash, PowerShell',
      'Kali Linux, Parrot OS',
      'Snort, Suricata, OpenVPN'
    ],
    entryLevelRoles: [
      'Tier 1 SOC Analyst',
      'Junior Security Administrator',
      'Information Security Associate',
      'Cyber Risk Analyst'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'SOC Analyst (Tier 1)',
        experience: '0 - 2 Years',
        description: 'Monitors real-time alerts, reviews log feeds, isolates basic malware, and escalates confirmed incidents.',
        typicalSalary: '₹4.5L - ₹8.5L / $68,000 - $90,000'
      },
      {
        level: 'Mid-Level',
        title: 'Cybersecurity Incident Responder / Tier 2 Analyst',
        experience: '2 - 5 Years',
        description: 'Leads digital forensics investigations, conducts malware reverse-engineering, and patches attack vectors.',
        typicalSalary: '₹10L - ₹19L / $100,000 - $135,000'
      },
      {
        level: 'Senior',
        title: 'Senior Security Consultant / Penetration Tester',
        experience: '5 - 8 Years',
        description: 'Executes ethical hacking engagements (Red Teaming), audits architecture defenses, and hardens cloud assets.',
        typicalSalary: '₹20L - ₹36L / $140,000 - $185,000'
      },
      {
        level: 'Executive',
        title: 'Chief Information Security Officer (CISO)',
        experience: '8+ Years',
        description: 'Sets overall enterprise security policy, manages legal compliance with GDPR/HIPAA, and directs cyber defense strategy.',
        typicalSalary: '₹40L - ₹75L+ / $190,000 - $280,000+'
      }
    ],
    salaryRange: {
      entry: '₹4.5L - ₹8.5L ($68,000 - $90,000)',
      mid: '₹10L - ₹19L ($100,000 - $135,000)',
      senior: '₹20L - ₹40L ($140,000 - $195,000)',
      currency: 'INR / USD',
      note: 'Significant global shortage of cyber defenders has made this role one of the most recession-resilient tech positions.'
    },
    opportunities: 'Zero-unemployment rate in cybersecurity for certified professionals. Projected 32% growth through 2032 as cyber warfare, ransomware, and digital extortion rise globally.',
    prerequisites: [
      'Solid grasp of how computer networks and the internet operate',
      'Understanding of basic computer hardware and operating system concepts',
      'High ethical standards and legal compliance awareness'
    ],
    suitableFor: [
      'Inquisitive minds who enjoy investigating anomalies and digital forensics',
      'Defenders who want to protect people and organizations from bad actors',
      'People who thrive in fast-paced operational environments where details matter'
    ],
    relatedCareers: [
      { title: 'Cloud Engineer', slug: 'cloud-engineer', reason: 'Constructs the cloud architectures that security analysts must audit and protect.' },
      { title: 'DevOps Engineer', slug: 'devops-engineer', reason: 'Integrates security tooling directly into developer delivery pipelines (DevSecOps).' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Writes application code requiring secure coding practices.' }
    ],
    recommendedCourseSlug: 'python-programming',
    roadmapSequence: [
      { step: 1, title: 'Computer Networks & Protocols (TCP/IP, HTTP, DNS)', skillSlug: 'networking', whyRequired: 'You cannot defend what you do not understand. Network packets form the basis of cyber defense.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Linux System Administration & Hardening', skillSlug: 'linux', whyRequired: 'Security tools and internet servers run on Linux; mastering permissions and logs is vital.', duration: '2 weeks (16 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 3, title: 'Python for Security Scripting', skillSlug: 'python', whyRequired: 'Automate log parsing, build custom port scanners, and automate incident response tasks.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 4, title: 'Network Security & Packet Analysis (Wireshark, Nmap)', skillSlug: 'network-security', whyRequired: 'Capture live network traffic, identify malicious payloads, and discover vulnerable open ports.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 5, title: 'SIEM & SOC Operations (Splunk, ELK)', skillSlug: 'siem', whyRequired: 'Learn how modern enterprise Security Operations Centers collect, analyze, and alert on telemetry.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'sql-fundamentals' },
      { step: 6, title: 'Ethical Hacking & Web Vulnerabilities (OWASP Top 10)', skillSlug: 'ethical-hacking', whyRequired: 'Understand attack vectors (SQL injection, XSS, CSRF) to properly patch and defend applications.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 7, title: 'Incident Response & Digital Forensics', skillSlug: 'incident-response', whyRequired: 'Reconstruct breach timelines, gather admissible digital evidence, and remediate ransomware.', duration: '2 weeks (20 hrs)', difficulty: 'advanced', courseSlug: 'python-programming' }
    ]
  },

  'data-scientist': {
    slug: 'data-scientist',
    title: 'Data Scientist',
    tagline: 'Leverage statistical modeling, machine learning, and big data to predict future business outcomes.',
    overview: 'A Data Scientist leverages advanced mathematics, statistical modeling, machine learning, and programming to extract deep predictive insights from complex datasets. They design machine learning models that forecast customer churn, personalize recommendations, and optimize operations.',
    whatTheyDo: 'Data Scientists formulate testable business hypotheses, engineer sophisticated numerical features, train predictive models (like random forests, gradient boosting, and neural networks), evaluate performance with mathematical rigor, and deploy models into production.',
    responsibilities: [
      'Formulate business problems into mathematical machine learning formulations.',
      'Perform in-depth exploratory data analysis and feature engineering on high-dimensional data.',
      'Train, fine-tune, and validate supervised and unsupervised predictive models.',
      'Evaluate model fairness, bias, accuracy, precision, and recall metrics.',
      'Design and interpret statistically rigorous A/B experiments for product features.',
      'Communicate data-driven strategic recommendations to senior leadership.'
    ],
    workplaces: [
      'AI-focused technology companies (OpenAI, Google, Uber, Netflix)',
      'Financial risk management & algorithmic trading firms',
      'Biomedical research institutes & pharmaceutical companies',
      'Automotive & autonomous mobility companies',
      'Retail and recommendation engine platforms'
    ],
    industries: [
      'Artificial Intelligence & Deep Tech',
      'FinTech & Quantitative Finance',
      'Bioinformatics & Healthcare Diagnostics',
      'E-Commerce & Digital Ads',
      'Transportation & Autonomous Systems'
    ],
    educationBackground: [
      "Master's or Bachelor's degree in Data Science, Computer Science, Statistics, Mathematics, or Physics.",
      'Deep portfolio showing Kaggle competitions, published papers, or production machine learning projects.'
    ],
    technicalSkills: [
      'Python & Scientific Libraries (NumPy, SciPy, Pandas, Scikit-learn)',
      'Linear Algebra, Multivariable Calculus & Probability Theory',
      'Supervised & Unsupervised Machine Learning Algorithms',
      'Deep Learning Frameworks (PyTorch, TensorFlow)',
      'SQL for Complex Feature Extraction',
      'A/B Testing & Causal Inference Methodology'
    ],
    softSkills: [
      'Scientific Skepticism & Rigorous Hypothesis Testing',
      'Translating Abstract Business Questions into Math Models',
      'Collaborative Engineering with Product and ML Teams',
      'Storytelling with Complex Probabilistic Outputs'
    ],
    toolsAndTechnologies: [
      'Python, Jupyter, Scikit-Learn',
      'PyTorch, TensorFlow, Hugging Face',
      'SQL, Spark, Databricks',
      'MLflow, Weights & Biases',
      'Tableau, Matplotlib, Seaborn'
    ],
    entryLevelRoles: [
      'Junior Data Scientist',
      'Associate Machine Learning Analyst',
      'Quantitative Research Assistant',
      'Predictive Analytics Associate'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Data Scientist',
        experience: '0 - 2 Years',
        description: 'Performs data wrangling, builds baseline ML models, runs A/B test analysis, and cleans complex data inputs.',
        typicalSalary: '₹6L - ₹12L / $85,000 - $115,000'
      },
      {
        level: 'Mid-Level',
        title: 'Data Scientist',
        experience: '2 - 5 Years',
        description: 'Designs predictive algorithms, handles end-to-end model training, builds feature pipelines, and collaborates with product.',
        typicalSalary: '₹14L - ₹26L / $120,000 - $165,000'
      },
      {
        level: 'Senior',
        title: 'Senior Data Scientist / Lead Scientist',
        experience: '5 - 8 Years',
        description: 'Owns complex ML architectures (recommendation systems, NLP pipelines), mentors teams, and drives core algorithm strategy.',
        typicalSalary: '₹28L - ₹48L / $165,000 - $225,000'
      },
      {
        level: 'Executive',
        title: 'Chief Data Scientist / VP of AI',
        experience: '8+ Years',
        description: 'Spearheads company-wide AI strategy, intellectual property development, and high-impact predictive roadmaps.',
        typicalSalary: '₹50L - ₹90L+ / $230,000 - $350,000+'
      }
    ],
    salaryRange: {
      entry: '₹6L - ₹12L ($85,000 - $115,000)',
      mid: '₹14L - ₹26L ($120,000 - $165,000)',
      senior: '₹28L - ₹52L ($170,000 - $240,000)',
      currency: 'INR / USD',
      note: 'One of the highest-paying analytical disciplines; advanced degrees and proven mathematical modeling command top compensation.'
    },
    opportunities: 'Global AI boom and big data expansion fuel massive demand for scientists capable of deriving predictive intelligence from massive enterprise data pools.',
    prerequisites: [
      'College-level mathematics (Calculus, Linear Algebra, Probability)',
      'Basic programming logic and familiarity with Python',
      'Desire to explore and question hypotheses rigorously'
    ],
    suitableFor: [
      'Thinkers with a strong affinity for math, statistics, and scientific methods',
      'Developers fascinated by teaching computers to discover patterns automatically',
      'Researchers who love experiment design and data analysis'
    ],
    relatedCareers: [
      { title: 'Machine Learning Engineer', slug: 'ml-engineer', reason: 'Focuses more on deploying, optimizing, and scaling models in production software.' },
      { title: 'Data Analyst', slug: 'data-analyst', reason: 'Focuses primarily on descriptive and diagnostic business intelligence rather than predictive algorithms.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Builds user-facing systems and application infrastructure.' }
    ],
    recommendedCourseSlug: 'data-analytics',
    roadmapSequence: [
      { step: 1, title: 'Python Programming for Scientific Computing', skillSlug: 'python', whyRequired: 'Master Python syntax, object-oriented concepts, and computational libraries.', duration: '3 weeks (30 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Mathematics for Data Science (Linear Algebra & Calculus)', skillSlug: 'math-for-ds', whyRequired: 'Vectors, matrix multiplications, gradients, and optimization power all machine learning.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 3, title: 'Probability & Inferential Statistics', skillSlug: 'statistics', whyRequired: 'Design valid experiments, calculate p-values, confidence intervals, and hypothesis tests.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 4, title: 'SQL & Data Warehousing', skillSlug: 'sql', whyRequired: 'Extract feature sets and transactional histories from big data relational stores.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 5, title: 'Data Analysis with Pandas & Visualization', skillSlug: 'pandas', whyRequired: 'Conduct exploratory data analysis, clean dirty entries, and engineer informative features.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 6, title: 'Machine Learning Algorithms (Scikit-Learn)', skillSlug: 'machine-learning', whyRequired: 'Train regression, decision trees, random forests, clustering, and ensemble models.', duration: '4 weeks (35 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 7, title: 'Deep Learning & Neural Networks (PyTorch)', skillSlug: 'deep-learning', whyRequired: 'Build multi-layer neural networks for image, sequence, and text processing tasks.', duration: '4 weeks (35 hrs)', difficulty: 'advanced', courseSlug: 'python-programming' }
    ]
  },

  'devops-engineer': {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    tagline: 'Bridge software development and IT operations with automated CI/CD and resilient platforms.',
    overview: 'A DevOps Engineer unites software development squads with IT operations. They build automated continuous integration and continuous deployment (CI/CD) pipelines, orchestrate containerized microservices, and manage production uptime, ensuring software is delivered quickly and reliably.',
    whatTheyDo: 'DevOps Engineers eliminate friction between developers writing code and systems running that code. They write pipeline scripts, manage Kubernetes clusters, configure automated rollback mechanisms, and ensure zero-downtime releases.',
    responsibilities: [
      'Design, build, and maintain automated CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins).',
      'Manage container orchestration using Kubernetes, Helm charts, and Docker.',
      'Implement automated testing and code quality gates within delivery pipelines.',
      'Manage production application logs, metrics, and distributed tracing (Prometheus, Grafana, Datadog).',
      'Automate infrastructure provisioning using Infrastructure as Code (Terraform).',
      'Participate in on-call rotation schedules and resolve production outages rapidly.'
    ],
    workplaces: [
      'Rapid-deployment tech startups and high-scale SaaS companies',
      'E-commerce platforms with continuous feature releases',
      'Financial services requiring compliant automated release audits',
      'Global consultancies specializing in cloud native migrations'
    ],
    industries: [
      'Software & SaaS',
      'FinTech & Online Payments',
      'Media Streaming & Gaming',
      'Telecom & IoT Systems',
      'Cloud Infrastructure Providers'
    ],
    educationBackground: [
      "Bachelor's in Computer Science, Software Engineering, or Information Systems.",
      'Equivalent operational experience with certifications such as CKA (Certified Kubernetes Administrator) or AWS DevOps Professional.'
    ],
    technicalSkills: [
      'CI/CD Pipeline Design (GitHub Actions, GitLab CI)',
      'Containerization & Orchestration (Docker, Kubernetes)',
      'Linux Kernel & System Administration',
      'Infrastructure as Code (Terraform, Ansible)',
      'Observability & APM (Prometheus, Grafana, ELK Stack)',
      'Scripting (Python, Bash, Go)'
    ],
    softSkills: [
      'Empathy for Developer Productivity and Developer Experience (DevEx)',
      'Decisive Problem Solving During Critical Incidents',
      'Collaboration Across Siloed Engineering Disciplines',
      'Relentless Desire to Automate Repetitive Manual Work'
    ],
    toolsAndTechnologies: [
      'Docker, Kubernetes, Helm, ArgoCD',
      'GitHub Actions, GitLab CI, Jenkins',
      'Terraform, Ansible',
      'Prometheus, Grafana, Datadog',
      'AWS, GCP, Linux, Bash'
    ],
    entryLevelRoles: [
      'Junior DevOps Engineer',
      'Release Engineering Associate',
      'Build & Automation Specialist',
      'Cloud Operations Associate'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior DevOps Engineer',
        experience: '0 - 2 Years',
        description: 'Maintains build scripts, assists with pipeline failures, writes Dockerfiles, and manages monitoring alerts.',
        typicalSalary: '₹5.5L - ₹9.5L / $72,000 - $98,000'
      },
      {
        level: 'Mid-Level',
        title: 'DevOps Engineer',
        experience: '2 - 5 Years',
        description: 'Constructs end-to-end GitOps pipelines, manages Kubernetes deployments, and automates multi-environment rollouts.',
        typicalSalary: '₹12L - ₹23L / $110,000 - $150,000'
      },
      {
        level: 'Senior',
        title: 'Senior Site Reliability / DevOps Engineer',
        experience: '5 - 8 Years',
        description: 'Designs multi-region high availability architectures, enforces SLA/SLO budgets, and leads disaster recovery drills.',
        typicalSalary: '₹24L - ₹42L / $155,000 - $205,000'
      },
      {
        level: 'Executive',
        title: 'Head of Platform Engineering / Director of DevOps',
        experience: '8+ Years',
        description: 'Defines internal developer platform strategy, tooling budgets, and enterprise reliability posture.',
        typicalSalary: '₹42L - ₹80L+ / $210,000 - $290,000+'
      }
    ],
    salaryRange: {
      entry: '₹5.5L - ₹9.5L ($72,000 - $98,000)',
      mid: '₹12L - ₹23L ($110,000 - $150,000)',
      senior: '₹25L - ₹46L ($160,000 - $215,000)',
      currency: 'INR / USD',
      note: 'Command high salaries due to direct impact on engineering deployment velocity and system uptime.'
    },
    opportunities: 'As software complexity expands, organizations cannot afford manual deployments. Platform engineering and DevOps continue to be top priorities for tech executives.',
    prerequisites: [
      'Familiarity with command line environments and software development basics',
      'Interest in automation, servers, and developer tooling'
    ],
    suitableFor: [
      'Developers who hate repetitive manual work and want to automate everything',
      'Engineers who enjoy operating systems, pipelines, and infrastructure scalability',
      'Individuals who enjoy collaborating across both coding and operations teams'
    ],
    relatedCareers: [
      { title: 'Cloud Engineer', slug: 'cloud-engineer', reason: 'Focuses on provisioning and designing cloud networking and infrastructure.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Writes the application code that DevOps pipelines deliver to users.' },
      { title: 'Cybersecurity Analyst', slug: 'cybersecurity-analyst', reason: 'Ensures pipeline deployments meet security and vulnerability compliance.' }
    ],
    recommendedCourseSlug: 'python-programming',
    roadmapSequence: [
      { step: 1, title: 'Linux Fundamentals & Bash Automation', skillSlug: 'linux', whyRequired: 'Build agents, servers, and containers run on Linux. Scripting in Bash is foundational.', duration: '2 weeks (16 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Git & Version Control Workflows', skillSlug: 'git', whyRequired: 'All DevOps processes stem from Git triggers, branching strategies, and pull requests.', duration: '1 week (10 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 3, title: 'Python for Systems Scripting', skillSlug: 'python', whyRequired: 'Create automated CLI utilities, call deployment APIs, and parse structured logs.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 4, title: 'Containerization with Docker', skillSlug: 'docker', whyRequired: 'Package software into self-contained immutable containers for consistent execution anywhere.', duration: '2 weeks (18 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 5, title: 'CI/CD Pipelines (GitHub Actions & GitLab)', skillSlug: 'cicd', whyRequired: 'Automate linting, unit testing, image builds, and automated deployments on every commit.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 6, title: 'Infrastructure as Code (Terraform)', skillSlug: 'terraform', whyRequired: 'Declare cloud infrastructure version-controlled alongside application code.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 7, title: 'Kubernetes Cluster Management & Monitoring', skillSlug: 'kubernetes', whyRequired: 'Orchestrate distributed container deployments, handle scaling, and monitor with Prometheus.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'python-programming' }
    ]
  },

  'ml-engineer': {
    slug: 'ml-engineer',
    title: 'Machine Learning Engineer',
    tagline: 'Take AI research models and deploy them as scalable, low-latency production software systems.',
    overview: 'A Machine Learning Engineer bridges the gap between theoretical data science prototypes and production software engineering. They design data pipelines, build feature stores, optimize model inference latency, and deploy robust ML architectures to serve real-time predictions at scale.',
    whatTheyDo: 'While data scientists invent or train experimental models, ML Engineers make those models run fast, reliably, and cost-effectively in production. They build MLOps pipelines, containerize neural networks, monitor model drift, and scale GPU/TPU training clusters.',
    responsibilities: [
      'Deploy and serve machine learning and deep learning models via low-latency REST/gRPC endpoints.',
      'Build end-to-end automated retraining and evaluation pipelines using MLOps tools (Kubeflow, MLflow).',
      'Optimize model architectures for inference performance (quantization, pruning, ONNX, TensorRT).',
      'Build real-time feature extraction pipelines for streaming and batch predictions.',
      'Monitor production model accuracy, latency, and distribution drift over time.',
      'Collaborate with backend engineers to integrate intelligent features into user-facing apps.'
    ],
    workplaces: [
      'Leading AI labs & tech giants (NVIDIA, OpenAI, Google, Apple, Microsoft)',
      'Autonomous vehicle and robotics companies',
      'High-traffic consumer apps running personalization & recommendation engines',
      'Healthcare AI startups running medical imaging diagnosis'
    ],
    industries: [
      'Artificial Intelligence & Robotics',
      'Autonomous Driving & Computer Vision',
      'Natural Language Processing & Generative AI',
      'FinTech & Algorithmic Risk Management',
      'E-Commerce & Search Engines'
    ],
    educationBackground: [
      "Bachelor's or Master's in Computer Science, AI, Robotics, or Electrical Engineering.",
      'Strong software engineering foundations combined with machine learning competencies.'
    ],
    technicalSkills: [
      'Python & High-Performance C++ for Inference',
      'Deep Learning Frameworks (PyTorch, TensorFlow)',
      'MLOps & Pipeline Tools (MLflow, Kubeflow, Weights & Biases)',
      'Model Optimization (ONNX Runtime, TensorRT, vLLM)',
      'Containerization & Cloud GPU Orchestration (Docker, Kubernetes)',
      'Software Architecture & Low-Latency API Design'
    ],
    softSkills: [
      'System-Level Thinking & Scalability Mindset',
      'Bridge Communication between Mathematicians and Software Architects',
      'Tenacity when Troubleshooting Numerical Instability & Memory Leaks',
      'Rigorous Benchmarking & Profiling Discipline'
    ],
    toolsAndTechnologies: [
      'PyTorch, Hugging Face Transformers',
      'Docker, Kubernetes, Ray',
      'MLflow, BentoML, FastAPI, Triton Inference Server',
      'TensorRT, ONNX, vLLM',
      'AWS SageMaker, Google Vertex AI'
    ],
    entryLevelRoles: [
      'Junior Machine Learning Engineer',
      'AI Software Engineer Associate',
      'ML Platform Developer',
      'Data & ML Pipeline Specialist'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior ML Engineer',
        experience: '0 - 2 Years',
        description: 'Builds data pipelines, writes inference wrappers, containerizes models, and assists in automated testing.',
        typicalSalary: '₹6.5L - ₹13L / $88,000 - $120,000'
      },
      {
        level: 'Mid-Level',
        title: 'Machine Learning Engineer',
        experience: '2 - 5 Years',
        description: 'Architects end-to-end MLOps systems, builds streaming feature stores, and optimizes model inference speed.',
        typicalSalary: '₹15L - ₹28L / $125,000 - $175,000'
      },
      {
        level: 'Senior',
        title: 'Senior MLOps / ML Infrastructure Engineer',
        experience: '5 - 8 Years',
        description: 'Manages distributed GPU training clusters, designs large LLM serving platforms, and guides architectural standards.',
        typicalSalary: '₹30L - ₹55L / $175,000 - $240,000'
      },
      {
        level: 'Executive',
        title: 'Director of Machine Learning / Chief AI Architect',
        experience: '8+ Years',
        description: 'Directs company AI software infrastructure, GPU compute procurement, and strategic AI integrations.',
        typicalSalary: '₹55L - ₹1Cr+ / $240,000 - $360,000+'
      }
    ],
    salaryRange: {
      entry: '₹6.5L - ₹13L ($88,000 - $120,000)',
      mid: '₹15L - ₹28L ($125,000 - $175,000)',
      senior: '₹30L - ₹60L ($180,000 - $250,000)',
      currency: 'INR / USD',
      note: 'Surging demand in Generative AI, Large Language Models (LLMs), and autonomous systems has made this one of the most lucrative tech roles.'
    },
    opportunities: 'Unprecedented growth in AI deployment worldwide. Organizations need engineers who know how to take experimental AI models and make them production-grade.',
    prerequisites: [
      'Proficiency in programming (Python, data structures, algorithms)',
      'Basic understanding of machine learning principles and math (calculus, linear algebra)',
      'Familiarity with server APIs and backend programming'
    ],
    suitableFor: [
      'Software engineers passionate about artificial intelligence who want to write production code',
      'Builders who enjoy performance optimization, parallel processing, and system efficiency',
      'Engineers excited about real-world deployment of LLMs, computer vision, and neural nets'
    ],
    relatedCareers: [
      { title: 'Data Scientist', slug: 'data-scientist', reason: 'Focuses more on the statistical exploration, hypothesis formulation, and model training.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Constructs the broader applications and user interfaces that interact with ML endpoints.' },
      { title: 'Cloud Engineer', slug: 'cloud-engineer', reason: 'Maintains the cloud hardware and network infrastructure where ML systems are deployed.' }
    ],
    recommendedCourseSlug: 'python-programming',
    roadmapSequence: [
      { step: 1, title: 'Python Mastery & Object-Oriented Design', skillSlug: 'python', whyRequired: 'The core language of all modern AI development and machine learning frameworks.', duration: '3 weeks (30 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 2, title: 'Data Structures, Algorithms & SQL', skillSlug: 'sql', whyRequired: 'Write performant code and efficiently extract massive training datasets from databases.', duration: '2 weeks (20 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 3, title: 'Applied Machine Learning (Scikit-Learn)', skillSlug: 'machine-learning', whyRequired: 'Understand supervised/unsupervised learning, validation, and feature preparation.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 4, title: 'Deep Learning with PyTorch', skillSlug: 'pytorch', whyRequired: 'Build, train, and inspect neural networks, CNNs, transformers, and embedding spaces.', duration: '4 weeks (35 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 5, title: 'Model Deployment & REST/gRPC APIs (FastAPI)', skillSlug: 'api-development', whyRequired: 'Expose models as low-latency microservices that accept inputs and return predictions.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 6, title: 'Docker, Kubernetes & GPU Orchestration', skillSlug: 'docker', whyRequired: 'Package ML runtimes with CUDA drivers and scale inference replicas in cluster nodes.', duration: '2 weeks (20 hrs)', difficulty: 'advanced', courseSlug: 'web-development' },
      { step: 7, title: 'MLOps, Model Serving & Drift Monitoring', skillSlug: 'mlops', whyRequired: 'Automate model retraining, versioning with MLflow, and production performance observability.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'python-programming' }
    ]
  },

  'ui-ux-designer': {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    tagline: 'Craft intuitive, accessible, and delightful digital user interfaces and product experiences.',
    overview: 'A UI/UX Designer designs the visual layouts, interactive behaviors, and overall user journey of digital software products. They combine user psychology, visual design systems, and rapid prototyping to ensure software is easy to understand, efficient, and visually appealing.',
    whatTheyDo: 'UI/UX Designers conduct user interviews, map user journeys, design wireframes, establish cohesive design systems (colors, typography, components in Figma), and prototype dynamic interactions before testing them with real users and handing them off to developers.',
    responsibilities: [
      'Conduct user research, customer interviews, and usability testing sessions.',
      'Synthesize user feedback into user personas, empathy maps, and journey maps.',
      'Design low-fidelity wireframes and high-fidelity interactive prototypes in Figma.',
      'Build and maintain scalable design systems with reusable tokens and components.',
      'Ensure web accessibility compliance (WCAG 2.1 AAA/AA standards).',
      'Collaborate closely with frontend engineers to ensure design fidelity in production code.'
    ],
    workplaces: [
      'Consumer software & mobile app companies (Airbnb, Spotify, Apple)',
      'Fintech and digital consumer banking platforms',
      'Product design agencies and creative studios',
      'Enterprise SaaS companies modernizing complex workflows'
    ],
    industries: [
      'Consumer Tech & Mobile Apps',
      'FinTech & Personal Finance',
      'E-Commerce & Luxury Brands',
      'HealthTech & Wellness',
      'EdTech & Interactive Learning'
    ],
    educationBackground: [
      "Degree in Interaction Design, Graphic Design, Human-Computer Interaction (HCI), Psychology, or CS.",
      'Strong portfolio demonstrating case studies of real problems solved with user-centered design.'
    ],
    technicalSkills: [
      'Figma & FigJam Mastery (Auto-layout, Components, Variables)',
      'Design Systems & UI Pattern Libraries',
      'User Research & Usability Testing Methods',
      'Information Architecture & Wireframing',
      'Prototyping & Micro-Interactions',
      'Fundamental understanding of HTML & CSS capabilities'
    ],
    softSkills: [
      'Deep Empathy for User Frustrations and Needs',
      'Visual Storytelling & Clear Design Presentation',
      'Receptive to Feedback & Fast Design Iteration',
      'Collaboration with Engineers and Product Managers'
    ],
    toolsAndTechnologies: [
      'Figma, FigJam, Sketch, Adobe XD',
      'Miro, Notion, Maze for Usability Testing',
      'HTML5, CSS3, Tailwind CSS (conceptual literacy)',
      'Lottie, Principle for Micro-Animations'
    ],
    entryLevelRoles: [
      'Junior UI/UX Designer',
      'Associate Product Designer',
      'Visual / Interaction Design Intern',
      'UX Researcher Assistant'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior UI/UX Designer',
        experience: '0 - 2 Years',
        description: 'Designs UI screens, maintains component variants, creates wireframes, and assists with user testing.',
        typicalSalary: '₹4.5L - ₹8.5L / $65,000 - $88,000'
      },
      {
        level: 'Mid-Level',
        title: 'Product Designer',
        experience: '2 - 5 Years',
        description: 'Owns end-to-end user experiences for major product flows, leads user research, and maintains design systems.',
        typicalSalary: '₹10L - ₹20L / $95,000 - $135,000'
      },
      {
        level: 'Senior',
        title: 'Senior Product Designer / Design Lead',
        experience: '5 - 8 Years',
        description: 'Sets design vision across multiple squad roadmaps, establishes enterprise design systems, and coaches designers.',
        typicalSalary: '₹22L - ₹38L / $140,000 - $185,000'
      },
      {
        level: 'Executive',
        title: 'VP of Design / Head of Product Design',
        experience: '8+ Years',
        description: 'Guides brand identity, user experience strategy, and design team organization across the company.',
        typicalSalary: '₹38L - ₹70L+ / $190,000 - $260,000+'
      }
    ],
    salaryRange: {
      entry: '₹4.5L - ₹8.5L ($65,000 - $88,000)',
      mid: '₹10L - ₹20L ($95,000 - $135,000)',
      senior: '₹22L - ₹40L ($140,000 - $190,000)',
      currency: 'INR / USD',
      note: 'High portfolio-driven field; designers who communicate clear business outcomes through their work earn premium salaries.'
    },
    opportunities: 'Every company now understands that poor user experience kills products. Demand for designers who craft smooth, accessible experiences has never been higher.',
    prerequisites: [
      'A keen eye for aesthetics, layout balance, and clarity',
      'Empathy for other people’s struggles when using digital tools',
      'Desire to build visual digital interfaces'
    ],
    suitableFor: [
      'Creative individuals who enjoy visual layout, color theory, and typography',
      'People interested in human psychology and how people interact with technology',
      'Those who want to work in tech building software without writing backend server code'
    ],
    relatedCareers: [
      { title: 'Product Manager', slug: 'product-manager', reason: 'Focuses on the business, timeline, and market feasibility of product features.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Transforms design mockups into working production code.' },
      { title: 'Digital Marketing Analyst', slug: 'digital-marketing-analyst', reason: 'Analyzes user conversion funnels and landing page performance.' }
    ],
    recommendedCourseSlug: 'web-development',
    roadmapSequence: [
      { step: 1, title: 'Design Principles & Visual Fundamentals', skillSlug: 'design-principles', whyRequired: 'Master typography, color harmony, visual hierarchy, contrast, and spacing rules.', duration: '2 weeks (16 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 2, title: 'Figma Mastery & Prototyping', skillSlug: 'figma', whyRequired: 'The industry-standard platform for collaborative UI design, components, and auto-layout.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 3, title: 'UX Research & User Journey Mapping', skillSlug: 'ux-research', whyRequired: 'Discover user pain points through interviews, survey data, and usability tests.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 4, title: 'Information Architecture & Wireframing', skillSlug: 'wireframing', whyRequired: 'Structure content hierarchy before spending time on colors and detailed visuals.', duration: '2 weeks (16 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 5, title: 'Design Systems & Component Libraries', skillSlug: 'design-systems', whyRequired: 'Build reusable tokens and variants that match developer component libraries.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 6, title: 'HTML & CSS Basics for Designers', skillSlug: 'web-development', whyRequired: 'Understand CSS Flexbox, Grid, and responsive breakpoints to design for real code.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 7, title: 'Portfolio Case Studies & Developer Handoff', skillSlug: 'portfolio-design', whyRequired: 'Document end-to-end case studies that showcase research, iterations, and business results.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'web-development' }
    ]
  },

  'business-analyst': {
    slug: 'business-analyst',
    title: 'Business Analyst',
    tagline: 'Bridge business strategy and technical systems to optimize operations and drive growth.',
    overview: 'A Business Analyst evaluates organizational processes, identifies efficiencies, gathers stakeholder requirements, and helps engineering teams build software solutions that directly increase profit and reduce overhead.',
    whatTheyDo: 'Business Analysts run stakeholder workshops, document Business Requirement Documents (BRD), analyze process workflows, build financial and operational models, and validate that finished software features satisfy strategic goals.',
    responsibilities: [
      'Liaise between executive business leaders and technical engineering squads.',
      'Elicit, analyze, and document functional and non-functional requirements.',
      'Create process flowcharts, wireframes, and use case diagrams.',
      'Conduct cost-benefit analysis and feasibility studies for prospective projects.',
      'Define User Acceptance Testing (UAT) criteria and coordinate sign-offs.',
      'Monitor post-implementation metrics to evaluate return on investment (ROI).'
    ],
    workplaces: [
      'Management consulting firms (McKinsey, BCG, Deloitte, Accenture)',
      'Banking, insurance, and asset management institutions',
      'Enterprise software and IT service consultancies',
      'Healthcare and government operational organizations'
    ],
    industries: [
      'Banking, Financial Services & Insurance (BFSI)',
      'Management & Strategy Consulting',
      'Healthcare & Hospital Administration',
      'Retail & Supply Chain Operations',
      'Telecommunications'
    ],
    educationBackground: [
      "Bachelor's in Business Administration (BBA), Computer Science, Finance, or Engineering; MBA is advantageous for senior leadership.",
      'Certifications such as CBAP (Certified Business Analysis Professional) or PMI-PBA.'
    ],
    technicalSkills: [
      'Requirement Gathering & Documentation (BRD, FRD, User Stories)',
      'Business Process Modeling & Notation (BPMN)',
      'SQL for Data Validation & Reporting',
      'Advanced Excel & Financial Modeling',
      'Agile / Scrum Methodologies (Jira, Confluence)',
      'Data Visualization Basics (Power BI, Tableau)'
    ],
    softSkills: [
      'Diplomatic Stakeholder Negotiation & Consensus Building',
      'Active Listening & Requirement Elicitation',
      'Clear Written and Verbal Executive Communication',
      'Structured Analytical Thinking & Process Decomposition'
    ],
    toolsAndTechnologies: [
      'Jira, Confluence, Trello, Azure DevOps',
      'Microsoft Excel, Visio, Lucidchart',
      'SQL (PostgreSQL, MySQL)',
      'Power BI, Tableau',
      'BPMN 2.0 tools'
    ],
    entryLevelRoles: [
      'Junior Business Analyst',
      'Associate Systems Analyst',
      'Business Operations Trainee',
      'Requirements Specialist'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Business Analyst',
        experience: '0 - 2 Years',
        description: 'Documents meeting minutes, drafts user stories, tracks Jira tickets, and conducts basic spreadsheet analysis.',
        typicalSalary: '₹4.5L - ₹8L / $64,000 - $85,000'
      },
      {
        level: 'Mid-Level',
        title: 'Business Analyst',
        experience: '2 - 5 Years',
        description: 'Owns requirements for major modules, coordinates UAT testing, builds process flows, and manages stakeholder expectations.',
        typicalSalary: '₹9L - ₹17L / $88,000 - $120,000'
      },
      {
        level: 'Senior',
        title: 'Lead Business Analyst / Principal Consultant',
        experience: '5 - 8 Years',
        description: 'Spearheads multi-million-dollar digital transformations, advises C-suite on operational re-architecture.',
        typicalSalary: '₹18L - ₹32L / $125,000 - $165,000'
      },
      {
        level: 'Executive',
        title: 'Director of Business Architecture / Product VP',
        experience: '8+ Years',
        description: 'Directs overall organizational process strategy, oversees business analysis practice, and aligns with enterprise roadmap.',
        typicalSalary: '₹35L - ₹65L+ / $175,000 - $240,000+'
      }
    ],
    salaryRange: {
      entry: '₹4.5L - ₹8L ($64,000 - $85,000)',
      mid: '₹9L - ₹17L ($88,000 - $120,000)',
      senior: '₹18L - ₹35L ($130,000 - $175,000)',
      currency: 'INR / USD',
      note: 'Lucrative opportunities in financial centers and top tier consulting firms.'
    },
    opportunities: 'Steady demand across every traditional company modernizing into digital software systems.',
    prerequisites: [
      'Strong communication skills and willingness to collaborate with diverse teams',
      'Comfort with spreadsheets and analytical problem-solving'
    ],
    suitableFor: [
      'People who enjoy connecting business objectives with practical tech execution',
      'Communicators who love organizing chaos into clear specifications and diagrams',
      'Those who want a high-impact tech career without writing thousands of lines of code'
    ],
    relatedCareers: [
      { title: 'Product Manager', slug: 'product-manager', reason: 'Focuses more broadly on product strategy, user discovery, and market differentiation.' },
      { title: 'Data Analyst', slug: 'data-analyst', reason: 'Focuses deeply on quantitative data queries, statistics, and dashboards.' },
      { title: 'Financial Analyst', slug: 'financial-analyst', reason: 'Specializes specifically in financial statements, modeling, and valuation.' }
    ],
    recommendedCourseSlug: 'data-analytics',
    roadmapSequence: [
      { step: 1, title: 'Business Fundamentals & Project Lifecycles', skillSlug: 'business-fundamentals', whyRequired: 'Understand how organizations make money, structure costs, and execute projects.', duration: '2 weeks (15 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 2, title: 'Agile & Scrum Methodologies (Jira & User Stories)', skillSlug: 'agile-scrum', whyRequired: 'Modern software is built in sprints; writing crisp user stories is crucial.', duration: '2 weeks (15 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 3, title: 'Advanced Excel & Business Modeling', skillSlug: 'excel', whyRequired: 'Build financial projections, evaluate ROI, and conduct sensitivity analysis.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 4, title: 'SQL for Business Analytics', skillSlug: 'sql', whyRequired: 'Verify data firsthand in corporate databases rather than relying on hearsay.', duration: '2 weeks (20 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 5, title: 'Process Mapping & Flowcharts (BPMN & Lucidchart)', skillSlug: 'process-mapping', whyRequired: 'Map out current state vs future state business workflows clearly.', duration: '2 weeks (15 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 6, title: 'Data Visualization & Reporting (Power BI)', skillSlug: 'data-visualization', whyRequired: 'Communicate operational KPIs to executives through intuitive charts.', duration: '2 weeks (18 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 7, title: 'Requirement Documentation & UAT Case Studies', skillSlug: 'brd-documentation', whyRequired: 'Build complete requirement specifications and design acceptance tests for portfolio.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' }
    ]
  },

  'product-manager': {
    slug: 'product-manager',
    title: 'Product Manager',
    tagline: 'Lead cross-functional teams to build products that customers love and that drive real business value.',
    overview: 'A Product Manager defines the "why", "what", and "when" of software features. Sitting at the intersection of business, technology, and user experience, they guide products from initial idea through launch, growth, and continuous iteration.',
    whatTheyDo: 'Product Managers conduct user research, prioritize feature backlogs based on business value, write Product Requirement Documents (PRDs), run sprint planning with engineers, coordinate marketing launches, and measure feature success using analytics.',
    responsibilities: [
      'Define the product vision, strategy, and quarterly roadmap.',
      'Conduct customer discovery calls to uncover unmet market needs.',
      'Prioritize product features using frameworks like RICE, Kano, or Value vs Effort.',
      'Author comprehensive Product Requirement Documents (PRDs) and user stories.',
      'Lead sprint planning, grooming, and demos with engineering and design teams.',
      'Analyze product telemetry (funnels, retention, DAU/MAU) to measure feature success.'
    ],
    workplaces: [
      'Tech giants & unicorn startups (Google, Stripe, Uber, Airbnb)',
      'Enterprise SaaS companies',
      'Fast-paced consumer mobile app startups',
      'Innovation labs within major enterprises'
    ],
    industries: [
      'Consumer Internet & Mobile Apps',
      'Enterprise Software & SaaS',
      'FinTech & Neobanks',
      'HealthTech & Wellness Platforms',
      'E-Commerce & Marketplaces'
    ],
    educationBackground: [
      "Bachelor's degree in Computer Science, Engineering, Business, or Economics; MBA is common among senior product leaders.",
      'Proven track record of shipping software products or launching ventures.'
    ],
    technicalSkills: [
      'Product Strategy & Roadmap Planning',
      'Product Analytics (Mixpanel, Amplitude, Google Analytics)',
      'A/B Testing & Experimentation Design',
      'Agile / Scrum Sprint Leadership',
      'Technical Literacy (APIs, System Architecture, Databases)',
      'Wireframing & Prototyping Basics'
    ],
    softSkills: [
      'Influence Without Authority (Leading Engineers & Designers)',
      'Strategic Prioritization & Knowing When to Say No',
      'Executive Communication & Public Presentation',
      'Deep Customer Empathy & Unbiased Listening'
    ],
    toolsAndTechnologies: [
      'Jira, Linear, Notion, Confluence',
      'Figma, FigJam, Miro',
      'Mixpanel, Amplitude, PostHog',
      'SQL (basic querying for product metrics)',
      'Segment, Google Analytics'
    ],
    entryLevelRoles: [
      'Associate Product Manager (APM)',
      'Junior Product Specialist',
      'Product Operations Associate',
      'Business Analyst transitioning to PM'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Associate Product Manager (APM)',
        experience: '0 - 2 Years',
        description: 'Manages specific sub-features, writes user stories, tracks release progress, and monitors bug reports.',
        typicalSalary: '₹6L - ₹14L / $85,000 - $115,000'
      },
      {
        level: 'Mid-Level',
        title: 'Product Manager',
        experience: '2 - 5 Years',
        description: 'Owns an entire product squad, defines quarterly OKRs, leads discovery, and ships major customer-facing features.',
        typicalSalary: '₹15L - ₹30L / $120,000 - $170,000'
      },
      {
        level: 'Senior',
        title: 'Senior PM / Group Product Manager',
        experience: '5 - 8 Years',
        description: 'Owns multi-product strategic initiatives, manages junior PMs, and collaborates directly with C-suite.',
        typicalSalary: '₹30L - ₹55L / $175,000 - $235,000'
      },
      {
        level: 'Executive',
        title: 'Chief Product Officer (CPO) / VP of Product',
        experience: '8+ Years',
        description: 'Determines overall company product vision, portfolio strategy, and product organization growth.',
        typicalSalary: '₹55L - ₹1Cr+ / $240,000 - $350,000+'
      }
    ],
    salaryRange: {
      entry: '₹6L - ₹14L ($85,000 - $115,000)',
      mid: '₹15L - ₹30L ($120,000 - $170,000)',
      senior: '₹32L - ₹60L ($180,000 - $250,000)',
      currency: 'INR / USD',
      note: 'One of the most competitive and well-compensated non-coding roles in the technology sector.'
    },
    opportunities: 'Every software company needs visionary leaders who can guide engineering resources towards what customers actually want.',
    prerequisites: [
      'Strong leadership qualities and comfort communicating with diverse audiences',
      'Curiosity about business models, user experience, and modern technology'
    ],
    suitableFor: [
      'Entrepreneurial thinkers who want to own a product end-to-end',
      'People who love combining design, business strategy, and technology',
      'Strong communicators who excel at leading cross-functional teams'
    ],
    relatedCareers: [
      { title: 'Business Analyst', slug: 'business-analyst', reason: 'Focuses deeply on internal process requirements and operational specifications.' },
      { title: 'UI/UX Designer', slug: 'ui-ux-designer', reason: 'Focuses on visual layout, interaction design, and usability research.' },
      { title: 'Software Developer', slug: 'software-developer', reason: 'Builds the technical features specified by the Product Manager.' }
    ],
    recommendedCourseSlug: 'web-development',
    roadmapSequence: [
      { step: 1, title: 'Product Thinking & Frameworks (RICE, OKRs)', skillSlug: 'product-thinking', whyRequired: 'Learn how world-class tech companies prioritize features and set goals.', duration: '2 weeks (16 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 2, title: 'Customer Discovery & User Research', skillSlug: 'customer-discovery', whyRequired: 'Conduct unbiased interviews to separate real customer problems from feature ideas.', duration: '2 weeks (16 hrs)', difficulty: 'beginner', courseSlug: 'web-development' },
      { step: 3, title: 'Technical Literacy for PMs (APIs & System Architecture)', skillSlug: 'tech-literacy', whyRequired: 'Understand how software is engineered so you can earn developers’ respect.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'python-programming' },
      { step: 4, title: 'Product Analytics & SQL (Amplitude, Mixpanel)', skillSlug: 'product-analytics', whyRequired: 'Query user funnels and retention curves yourself without waiting on data teams.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'sql-fundamentals' },
      { step: 5, title: 'Writing PRDs & Agile Leadership', skillSlug: 'prds', whyRequired: 'Write clear, unambiguous specifications that developers can build without confusion.', duration: '2 weeks (18 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 6, title: 'Go-to-Market Strategy & Launch Metrics', skillSlug: 'gtm-strategy', whyRequired: 'Coordinate product launches across sales, marketing, and customer support.', duration: '2 weeks (16 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 7, title: 'Capstone: End-to-End Product PRD & Tear-Down', skillSlug: 'pm-portfolio', whyRequired: 'Build an impressive portfolio case study of a real software product redesign.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'web-development' }
    ]
  },

  'digital-marketing-analyst': {
    slug: 'digital-marketing-analyst',
    title: 'Digital Marketing Analyst',
    tagline: 'Optimize marketing acquisition channels, conversion funnels, and advertising ROI with data.',
    overview: 'A Digital Marketing Analyst investigates data from search engines, paid ad platforms, social media, and email campaigns to optimize customer acquisition funnels, reduce cost per acquisition (CPA), and maximize marketing ROI.',
    whatTheyDo: 'They analyze Google Ads, Meta Ads, and organic search traffic, track user journey conversions in Google Analytics 4, perform A/B tests on landing pages, and provide growth marketing recommendations to management.',
    responsibilities: [
      'Monitor and optimize paid advertising campaigns (Google Ads, Meta Ads, LinkedIn Ads).',
      'Analyze traffic attribution and user behavior in Google Analytics 4 (GA4).',
      'Conduct search engine optimization (SEO) audits and keyword opportunity analysis.',
      'Design A/B tests for landing pages and email newsletters to boost conversion rates.',
      'Calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), and Return on Ad Spend (ROAS).',
      'Create weekly performance dashboards for marketing and executive teams.'
    ],
    workplaces: [
      'Digital marketing agencies and growth consulting firms',
      'E-commerce brands and Direct-to-Consumer (D2C) businesses',
      'B2B SaaS companies focused on inbound lead generation',
      'Fast-growing tech startups scaling customer acquisition'
    ],
    industries: [
      'E-Commerce & Digital Retail',
      'SaaS & B2B Technology',
      'Consumer Goods & Lifestyle Brands',
      'EdTech & Online Learning',
      'Travel & Hospitality'
    ],
    educationBackground: [
      "Bachelor's in Marketing, Business, Communications, Statistics, or related discipline.",
      'Certifications (Google Analytics 4, Google Ads, Meta Certified Digital Marketing Associate).'
    ],
    technicalSkills: [
      'Web Analytics (Google Analytics 4, Google Tag Manager)',
      'Paid Media Management (Google Ads, Meta Ads Manager)',
      'Search Engine Optimization (Semrush, Ahrefs, Search Console)',
      'A/B Testing & Conversion Rate Optimization (CRO)',
      'Spreadsheets & Data Manipulation (Excel, Google Sheets)',
      'SQL for Marketing Attribution (advantageous)'
    ],
    softSkills: [
      'Creative Experimentation Combined with Numerical Rigor',
      'Consumer Psychology & Empathy for Buyer Journeys',
      'Agility to Adapt to Algorithm Updates and Ad Policies',
      'Storytelling with Growth Metrics'
    ],
    toolsAndTechnologies: [
      'Google Analytics 4 (GA4), Google Tag Manager',
      'Google Ads, Meta Business Suite',
      'Semrush, Ahrefs, Screaming Frog',
      'Looker Studio, Microsoft Excel',
      'HubSpot, Mailchimp, Klaviyo'
    ],
    entryLevelRoles: [
      'Junior Marketing Analyst',
      'PPC / Search Associate',
      'Growth Marketing Intern',
      'SEO & Content Analyst'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Marketing Analyst',
        experience: '0 - 2 Years',
        description: 'Monitors ad campaigns, tracks UTM tags, generates weekly KPI sheets, and runs keyword audits.',
        typicalSalary: '₹3.8L - ₹7L / $55,000 - $75,000'
      },
      {
        level: 'Mid-Level',
        title: 'Digital Marketing Analyst / Growth Marketer',
        experience: '2 - 5 Years',
        description: 'Manages substantial ad budgets, optimizes multichannel attribution, runs landing page experiments, and lifts ROAS.',
        typicalSalary: '₹8L - ₹16L / $80,000 - $110,000'
      },
      {
        level: 'Senior',
        title: 'Senior Growth Analyst / Head of Performance Marketing',
        experience: '5 - 8 Years',
        description: 'Directs full-funnel marketing strategies, manages agency relationships, and allocates million-dollar budgets.',
        typicalSalary: '₹16L - ₹28L / $115,000 - $155,000'
      },
      {
        level: 'Executive',
        title: 'VP of Growth / Chief Marketing Officer (CMO)',
        experience: '8+ Years',
        description: 'Oversees overall brand, growth, and customer acquisition engine across all international markets.',
        typicalSalary: '₹30L - ₹55L+ / $165,000 - $240,000+'
      }
    ],
    salaryRange: {
      entry: '₹3.8L - ₹7L ($55,000 - $75,000)',
      mid: '₹8L - ₹16L ($80,000 - $110,000)',
      senior: '₹18L - ₹30L ($120,000 - $165,000)',
      currency: 'INR / USD',
      note: 'Performance marketers who deliver high ROAS on ad spends command aggressive performance bonuses and commissions.'
    },
    opportunities: 'With global commerce moving permanently digital, businesses continuously allocate budgets to data-driven marketing analysts.',
    prerequisites: [
      'Comfort with basic math, percentages, and spreadsheet calculations',
      'Interest in consumer psychology and digital media trends'
    ],
    suitableFor: [
      'Analytical thinkers who also appreciate creative advertising copy and visuals',
      'People who enjoy measuring the immediate financial return of their ideas',
      'Those who want a data-oriented career without deep software programming requirements'
    ],
    relatedCareers: [
      { title: 'Data Analyst', slug: 'data-analyst', reason: 'Focuses more broadly on data warehouses, SQL, and enterprise-wide business operations.' },
      { title: 'UI/UX Designer', slug: 'ui-ux-designer', reason: 'Creates the landing pages and user interfaces that marketing analysts optimize.' },
      { title: 'Business Analyst', slug: 'business-analyst', reason: 'Analyzes organizational operational procedures rather than external marketing channels.' }
    ],
    recommendedCourseSlug: 'data-analytics',
    roadmapSequence: [
      { step: 1, title: 'Digital Marketing Channels & Funnels', skillSlug: 'digital-marketing', whyRequired: 'Understand top-of-funnel, middle-of-funnel, and bottom-of-funnel consumer journeys.', duration: '2 weeks (15 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 2, title: 'Google Analytics 4 & Tag Tracking', skillSlug: 'ga4', whyRequired: 'Implement event tags, track UTM parameters, and map out attribution funnels.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 3, title: 'Advanced Spreadsheets & Metric Calculations (CAC, LTV)', skillSlug: 'excel', whyRequired: 'Model customer unit economics and calculate return on advertising spend (ROAS).', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 4, title: 'Paid Advertising (Google Search & Meta Ads)', skillSlug: 'paid-media', whyRequired: 'Set up ad auctions, target audiences, optimize bidding strategies, and manage budgets.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 5, title: 'Search Engine Optimization (SEO) & Content Strategy', skillSlug: 'seo', whyRequired: 'Audit website crawlability, target high-intent search keywords, and build organic traffic.', duration: '2 weeks (18 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 6, title: 'Conversion Rate Optimization & A/B Testing', skillSlug: 'cro', whyRequired: 'Test landing page variations systematically to convert more visitors into paying leads.', duration: '2 weeks (16 hrs)', difficulty: 'intermediate', courseSlug: 'web-development' },
      { step: 7, title: 'Executive Reporting & Looker Studio Dashboards', skillSlug: 'reporting', whyRequired: 'Automate marketing reporting so clients and executives can review metrics live.', duration: '2 weeks (16 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' }
    ]
  },

  'financial-analyst': {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    tagline: 'Analyze financial health, build forecasting models, and guide investment capital decisions.',
    overview: 'A Financial Analyst evaluates past and present financial data to forecast future economic conditions and guide investment decisions. They construct discounted cash flow (DCF) models, assess company valuations, and provide recommendations on capital allocation.',
    whatTheyDo: 'Financial Analysts read balance sheets, income statements, and cash flow reports, construct financial forecasting models in Excel, evaluate market trends, assess investment risks, and prepare investment memos for leadership or clients.',
    responsibilities: [
      'Build dynamic 3-statement financial models and forecasting projections in Excel.',
      'Analyze quarterly financial statements (10-K, 10-Q) and identify operational variances.',
      'Conduct valuation analysis using DCF, comparable company analysis (Comps), and precedent transactions.',
      'Monitor macroeconomic variables (interest rates, inflation) and industry trends.',
      'Prepare investment memos and slide decks for management and investment committees.',
      'Assist with annual corporate budgeting and capital allocation strategies.'
    ],
    workplaces: [
      'Investment banks (Goldman Sachs, JPMorgan, Morgan Stanley)',
      'Private equity and venture capital funds',
      'Corporate finance departments in Fortune 500 corporations',
      'Commercial banks, wealth management, and mutual funds'
    ],
    industries: [
      'Investment Banking & Capital Markets',
      'Corporate Finance & Enterprise Treasury',
      'Asset Management & Private Equity',
      'FinTech & WealthTech',
      'Real Estate & Infrastructure Investment'
    ],
    educationBackground: [
      "Bachelor's degree in Finance, Economics, Accounting, Mathematics, or Business Administration.",
      'Chartered Financial Analyst (CFA) or Financial Modeling certifications provide massive career acceleration.'
    ],
    technicalSkills: [
      'Financial Modeling & 3-Statement Linking in Excel',
      'Corporate Valuation (DCF, Multiples, LBO basics)',
      'Financial Statement Analysis (Balance Sheet, Income, Cash Flow)',
      'Capital Budgeting & Cost of Capital (WACC)',
      'Variance Analysis & Rolling Forecasts',
      'Financial Data Visualization & Pitch Decks'
    ],
    softSkills: [
      'Exceptional Precision & Zero-Tolerance for Numerical Errors',
      'High Stamina & Discipline under Deal Deadlines',
      'Commercial Acumen & Market Curiosity',
      'Persuasive Presentation of Financial Theses'
    ],
    toolsAndTechnologies: [
      'Advanced Microsoft Excel (Keyboard shortcuts, VBA basics)',
      'Bloomberg Terminal, FactSet, Capital IQ',
      'PowerPoint (Executive Pitch Decks)',
      'Python for Financial Analysis (Pandas, NumPy)',
      'Power BI for Corporate FP&A'
    ],
    entryLevelRoles: [
      'Financial Analyst (FP&A)',
      'Investment Banking Analyst (1st Year)',
      'Junior Equity Research Associate',
      'Credit Risk Analyst'
    ],
    careerProgression: [
      {
        level: 'Entry-Level',
        title: 'Junior Financial Analyst / IB Analyst',
        experience: '0 - 2 Years',
        description: 'Updates financial models, pulls historical filings, performs comps analysis, and formats presentation decks.',
        typicalSalary: '₹6L - ₹14L / $85,000 - $125,000'
      },
      {
        level: 'Mid-Level',
        title: 'Senior Financial Analyst / Associate',
        experience: '2 - 5 Years',
        description: 'Builds complex valuation models independently, manages corporate budget variance, and leads deal due diligence.',
        typicalSalary: '₹14L - ₹28L / $125,000 - $185,000'
      },
      {
        level: 'Senior',
        title: 'Finance Manager / VP of Investment Banking',
        experience: '5 - 8 Years',
        description: 'Leads transactions, manages client relationships, guides corporate M&A strategies, and oversees teams of analysts.',
        typicalSalary: '₹28L - ₹55L / $190,000 - $300,000+'
      },
      {
        level: 'Executive',
        title: 'Chief Financial Officer (CFO) / Managing Director',
        experience: '8+ Years',
        description: 'Controls company-wide capital allocation, investor relations, debt financing, and overall corporate fiscal health.',
        typicalSalary: '₹55L - ₹1.2Cr+ / $350,000 - $600,000+'
      }
    ],
    salaryRange: {
      entry: '₹6L - ₹14L ($85,000 - $125,000)',
      mid: '₹14L - ₹28L ($125,000 - $185,000)',
      senior: '₹30L - ₹65L ($200,000 - $350,000+)',
      currency: 'INR / USD',
      note: 'Investment banking and private equity roles pay substantial annual bonuses (often 50% - 100%+ of base salary).'
    },
    opportunities: 'Capital markets and corporations continually require skilled modelers to evaluate investments, mergers, and financial stability.',
    prerequisites: [
      'Proficiency in algebra, interest calculations, and percentages',
      'Interest in business markets, investing, and economic news',
      'Comfort spending significant time in spreadsheet software'
    ],
    suitableFor: [
      'Meticulous thinkers who enjoy analyzing business performance and valuation',
      'People interested in Wall Street, investing, and corporate strategy',
      'Those who thrive in high-stakes environments where financial decisions shape companies'
    ],
    relatedCareers: [
      { title: 'Data Analyst', slug: 'data-analyst', reason: 'Focuses on wider enterprise databases, SQL, and business operational patterns.' },
      { title: 'Business Analyst', slug: 'business-analyst', reason: 'Focuses on software and operational workflows rather than capital valuation.' },
      { title: 'Data Scientist', slug: 'data-scientist', reason: 'Applies complex machine learning to predict quantitative variables.' }
    ],
    recommendedCourseSlug: 'data-analytics',
    roadmapSequence: [
      { step: 1, title: 'Accounting Foundations & 3 Financial Statements', skillSlug: 'accounting', whyRequired: 'Income statement, balance sheet, and cash flows are the language of finance.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 2, title: 'Financial Modeling in Excel Mastery', skillSlug: 'excel', whyRequired: 'Master dynamic 3-statement financial models, keyboard shortcuts, and scenario toggles.', duration: '3 weeks (25 hrs)', difficulty: 'beginner', courseSlug: 'data-analytics' },
      { step: 3, title: 'Corporate Finance & Capital Structure (WACC)', skillSlug: 'corporate-finance', whyRequired: 'Understand cost of equity, debt financing, and capital optimization.', duration: '2 weeks (16 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 4, title: 'Valuation Methodologies (DCF & Trading Comps)', skillSlug: 'valuation', whyRequired: 'Calculate intrinsic enterprise value using discounted free cash flow models.', duration: '3 weeks (25 hrs)', difficulty: 'intermediate', courseSlug: 'data-analytics' },
      { step: 5, title: 'SQL & Data Extraction for FP&A', skillSlug: 'sql', whyRequired: 'Extract raw corporate ledger transactions from ERP systems without relying on exports.', duration: '2 weeks (18 hrs)', difficulty: 'beginner', courseSlug: 'sql-fundamentals' },
      { step: 6, title: 'Python for Financial Data & Automation', skillSlug: 'python', whyRequired: 'Automate stock price pulls, monte carlo simulations, and portfolio risk calculations.', duration: '2 weeks (20 hrs)', difficulty: 'intermediate', courseSlug: 'python-programming' },
      { step: 7, title: 'Investment Pitch Deck & Capstone Valuation', skillSlug: 'financial-pitch', whyRequired: 'Deliver a comprehensive equity research initiation report on a public company.', duration: '3 weeks (25 hrs)', difficulty: 'advanced', courseSlug: 'data-analytics' }
    ]
  }
};

export function getCareerProfile(slug: string): CareerProfile | null {
  if (CAREER_PROFILES[slug]) {
    return CAREER_PROFILES[slug];
  }
  // Try case-insensitive or partial match
  const lower = slug.toLowerCase();
  for (const key of Object.keys(CAREER_PROFILES)) {
    if (key.toLowerCase() === lower || key.replace(/-/g, '') === lower.replace(/-/g, '')) {
      return CAREER_PROFILES[key];
    }
  }
  return null;
}
