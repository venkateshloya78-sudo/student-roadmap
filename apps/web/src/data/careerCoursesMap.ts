export interface CareerReference {
  slug: string;
  title: string;
}

export interface CourseCareerMapping {
  courseSlug: string;
  relatedCareers: CareerReference[];
}

export const COURSE_CAREERS_MAP: Record<string, CareerReference[]> = {
  'data-structures-algorithms': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'ml-engineer', title: 'ML Engineer' },
    { slug: 'devops-engineer', title: 'DevOps Engineer' },
  ],
  'git-github': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'devops-engineer', title: 'DevOps Engineer' },
    { slug: 'cloud-engineer', title: 'Cloud Engineer' },
  ],
  'cloud-computing': [
    { slug: 'cloud-engineer', title: 'Cloud Engineer' },
    { slug: 'devops-engineer', title: 'DevOps Engineer' },
    { slug: 'software-developer', title: 'Software Developer' },
  ],
  'linux-system-administration': [
    { slug: 'devops-engineer', title: 'DevOps Engineer' },
    { slug: 'cloud-engineer', title: 'Cloud Engineer' },
    { slug: 'cybersecurity-analyst', title: 'Cybersecurity Analyst' },
  ],
  'devops-engineering': [
    { slug: 'devops-engineer', title: 'DevOps Engineer' },
    { slug: 'cloud-engineer', title: 'Cloud Engineer' },
    { slug: 'software-developer', title: 'Software Developer' },
  ],
  'cybersecurity-fundamentals': [
    { slug: 'cybersecurity-analyst', title: 'Cybersecurity Analyst' },
    { slug: 'cloud-engineer', title: 'Cloud Engineer' },
    { slug: 'software-developer', title: 'Software Developer' },
  ],
  'software-engineering': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'product-manager', title: 'Product Manager' },
    { slug: 'business-analyst', title: 'Business Analyst' },
  ],
  'mobile-app-development': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'ui-ux-designer', title: 'UI/UX Designer' },
  ],
  'python-programming': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'data-analyst', title: 'Data Analyst' },
    { slug: 'data-scientist', title: 'Data Scientist' },
    { slug: 'ml-engineer', title: 'ML Engineer' },
  ],
  'sql-fundamentals': [
    { slug: 'data-analyst', title: 'Data Analyst' },
    { slug: 'business-analyst', title: 'Business Analyst' },
    { slug: 'financial-analyst', title: 'Financial Analyst' },
    { slug: 'software-developer', title: 'Software Developer' },
  ],
  'data-analytics': [
    { slug: 'data-analyst', title: 'Data Analyst' },
    { slug: 'business-analyst', title: 'Business Analyst' },
    { slug: 'financial-analyst', title: 'Financial Analyst' },
    { slug: 'digital-marketing-analyst', title: 'Digital Marketing Analyst' },
  ],
  'web-development': [
    { slug: 'software-developer', title: 'Software Developer' },
    { slug: 'ui-ux-designer', title: 'UI/UX Designer' },
    { slug: 'product-manager', title: 'Product Manager' },
  ],
};

export function getRelatedCareersForCourse(courseSlug: string): CareerReference[] {
  return COURSE_CAREERS_MAP[courseSlug] || [
    { slug: 'software-developer', title: 'Software Developer' },
  ];
}

export const CAREER_COURSES_MAP: Record<string, string[]> = {
  'data-analyst': ['data-analytics', 'sql-fundamentals', 'python-programming'],
  'software-developer': ['data-structures-algorithms', 'software-engineering', 'git-github', 'web-development', 'python-programming', 'sql-fundamentals'],
  'cloud-engineer': ['cloud-computing', 'linux-system-administration', 'devops-engineering', 'cybersecurity-fundamentals', 'python-programming'],
  'cybersecurity-analyst': ['cybersecurity-fundamentals', 'linux-system-administration', 'cloud-computing', 'python-programming', 'sql-fundamentals'],
  'data-scientist': ['data-analytics', 'python-programming', 'data-structures-algorithms', 'sql-fundamentals'],
  'devops-engineer': ['devops-engineering', 'cloud-computing', 'linux-system-administration', 'git-github', 'software-engineering'],
  'ml-engineer': ['data-structures-algorithms', 'python-programming', 'devops-engineering', 'cloud-computing', 'sql-fundamentals'],
  'ui-ux-designer': ['web-development', 'mobile-app-development', 'software-engineering'],
  'business-analyst': ['data-analytics', 'sql-fundamentals', 'software-engineering'],
  'product-manager': ['software-engineering', 'web-development', 'data-analytics'],
  'digital-marketing-analyst': ['data-analytics', 'web-development'],
  'financial-analyst': ['data-analytics', 'sql-fundamentals', 'python-programming'],
};

export function getRecommendedCoursesForCareer(careerSlug: string): string[] {
  return CAREER_COURSES_MAP[careerSlug] || ['python-programming', 'web-development'];
}
