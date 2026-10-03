/**
 * courseVideos.ts
 * Curated high-definition video service for course lessons.
 * Provides embedded video tutorials, channel credits, chapters, and key takeaways.
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

const DEFAULT_PYTHON_VIDEO: CourseVideoData = {
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

const DEFAULT_SQL_VIDEO: CourseVideoData = {
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

const DEFAULT_WEB_VIDEO: CourseVideoData = {
  youtubeId: 'mU6anWqZJcc',
  title: 'HTML & CSS Full Course - Modern Web Development',
  channel: 'freeCodeCamp.org',
  duration: '2 hr 15 min',
  description: 'Learn HTML5 semantic structure, modern CSS layouts (Flexbox and Grid), and responsive design principles.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'HTML Document Structure & Head Tags' },
    { timeSeconds: 540, timeLabel: '09:00', title: 'Semantic Tags: Header, Nav, Main, Footer' },
    { timeSeconds: 1500, timeLabel: '25:00', title: 'Forms, Inputs, and Accessible Attributes' },
    { timeSeconds: 2700, timeLabel: '45:00', title: 'CSS Box Model: Margin, Border, Padding' },
    { timeSeconds: 4200, timeLabel: '1:10:00', title: 'CSS Flexbox Layout Mastery' },
    { timeSeconds: 5700, timeLabel: '1:35:00', title: 'Responsive Media Queries & Mobile First' },
  ],
  keyTakeaways: [
    'How the browser DOM tree is constructed from HTML elements',
    'Responsive mobile-first styling using CSS Flexbox and Grid',
    'Writing accessible, SEO-friendly semantic markup',
    'Structuring clean UI components without CSS overflow bugs'
  ],
  alternativeVideos: [
    {
      youtubeId: 'PkZNo7MFNFg',
      title: 'JavaScript Tutorial for Beginners',
      channel: 'freeCodeCamp.org',
      duration: '3 hr 26 min'
    },
    {
      youtubeId: 'bMknfKXIFA8',
      title: 'React Course 2024 - Learn Modern React with Projects',
      channel: 'freeCodeCamp.org',
      duration: '5 hr 10 min'
    }
  ]
};

const DEFAULT_ANALYTICS_VIDEO: CourseVideoData = {
  youtubeId: 'vmEHCJofslg',
  title: 'Pandas & Python for Data Analytics - Complete Crash Course',
  channel: 'Keith Galli',
  duration: '1 hr 00 min',
  description: 'Learn real-world data analysis with Python, Pandas DataFrames, data cleaning, and statistical visualizations.',
  chapters: [
    { timeSeconds: 0, timeLabel: '00:00', title: 'Introduction to Data Analytics & Pandas' },
    { timeSeconds: 300, timeLabel: '05:00', title: 'Loading CSV, Excel and JSON Data' },
    { timeSeconds: 780, timeLabel: '13:00', title: 'Reading Data, Filtering Rows & Columns' },
    { timeSeconds: 1560, timeLabel: '26:00', title: 'Sorting, Describing & Statistical Summaries' },
    { timeSeconds: 2280, timeLabel: '38:00', title: 'Grouping & Aggregating with GroupBy' },
    { timeSeconds: 3000, timeLabel: '50:00', title: 'Exporting Cleaned Datasets & Visualizing' },
  ],
  keyTakeaways: [
    'The end-to-end data analytics lifecycle: ingestion, cleaning, transformation, and reporting',
    'Handling missing values, duplicates, and inconsistent data formats',
    'High-performance data manipulation with Pandas Series and DataFrames',
    'Transforming raw numbers into actionable business insights'
  ],
  alternativeVideos: [
    {
      youtubeId: 'xxpc-HPKN28',
      title: 'Statistics for Data Science - Full Course',
      channel: 'freeCodeCamp.org',
      duration: '2 hr 45 min'
    },
    {
      youtubeId: 'zyGfECfJ9BY',
      title: 'Data Analysis with Python - Full 10-Hour Course',
      channel: 'freeCodeCamp.org',
      duration: '9 hr 56 min'
    }
  ]
};

// Specialized video lookups for specific lessons or courses
export function getLessonVideoData(courseSlug: string, lessonTitle?: string): CourseVideoData {
  const normTitle = (lessonTitle || '').toLowerCase();
  const slug = (courseSlug || '').toLowerCase();

  // Python specific topics
  if (slug.includes('python')) {
    if (normTitle.includes('variable') || normTitle.includes('data type')) {
      return {
        youtubeId: 'cQT33yu9pY8',
        title: 'Python Variables, Memory Addresses and Data Types',
        channel: 'Corey Schafer',
        duration: '12 min 40 sec',
        description: 'Understand how variables work behind the scenes in Python, dynamic typing, and primitive types.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'Introduction to Variables' },
          { timeSeconds: 150, timeLabel: '02:30', title: 'Naming Rules and Conventions' },
          { timeSeconds: 320, timeLabel: '05:20', title: 'Dynamic Typing and id() Memory Check' },
          { timeSeconds: 540, timeLabel: '09:00', title: 'Type Conversions: int(), float(), str()' },
          { timeSeconds: 700, timeLabel: '11:40', title: 'Summary & Best Practices' },
        ],
        keyTakeaways: [
          'Variables in Python are references pointing to objects in memory',
          'Python uses dynamic typing—you do not need to declare types explicitly',
          'Use type() to inspect the runtime class and int()/float() to safely cast types'
        ],
        alternativeVideos: DEFAULT_PYTHON_VIDEO.alternativeVideos
      };
    }
    if (normTitle.includes('loop') || normTitle.includes('while') || normTitle.includes('for')) {
      return {
        youtubeId: '6iF8Xb7Z3wQ',
        title: 'Python Loops and Iterations: For/While Loops Tutorial',
        channel: 'Corey Schafer',
        duration: '10 min 12 sec',
        description: 'Learn how to iterate over ranges, lists, strings with for and while loops, including break and continue.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'The For Loop & range() Function' },
          { timeSeconds: 190, timeLabel: '03:10', title: 'Break and Continue Statements' },
          { timeSeconds: 360, timeLabel: '06:00', title: 'Nested Loops Explained' },
          { timeSeconds: 480, timeLabel: '08:00', title: 'While Loops and Avoiding Infinite Loops' },
        ],
        keyTakeaways: [
          'Use for loops when iterating over a known sequence or collection',
          'Use while loops when repeating until a dynamic condition becomes false',
          'Use break to terminate loops immediately and continue to skip to the next iteration'
        ],
        alternativeVideos: DEFAULT_PYTHON_VIDEO.alternativeVideos
      };
    }
    if (normTitle.includes('function') || normTitle.includes('parameter') || normTitle.includes('argument')) {
      return {
        youtubeId: '9Os0o3wzS_I',
        title: 'Python Functions - Complete Guide & Best Practices',
        channel: 'Corey Schafer',
        duration: '21 min 05 sec',
        description: 'A comprehensive guide to defining functions, parameters, return statements, and docstrings.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'Defining Functions with def Keyword' },
          { timeSeconds: 300, timeLabel: '05:00', title: 'Return Values vs Print Statements' },
          { timeSeconds: 620, timeLabel: '10:20', title: 'Positional and Keyword Arguments' },
          { timeSeconds: 900, timeLabel: '15:00', title: '*args and **kwargs Explained' },
        ],
        keyTakeaways: [
          'Functions promote DRY (Don\'t Repeat Yourself) modular architecture',
          'Return statements send values back to the caller; unreturned functions yield None',
          'Parameters allow flexible, reusable logic across large applications'
        ],
        alternativeVideos: DEFAULT_PYTHON_VIDEO.alternativeVideos
      };
    }
    if (normTitle.includes('object') || normTitle.includes('class') || normTitle.includes('oop')) {
      return {
        youtubeId: 'ZDa-Z5JzLYM',
        title: 'Python OOP Tutorial 1: Classes and Instances',
        channel: 'Corey Schafer',
        duration: '15 min 45 sec',
        description: 'Master Object-Oriented Programming: classes, instances, __init__ constructor, and self parameter.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'Why Object-Oriented Programming?' },
          { timeSeconds: 210, timeLabel: '03:30', title: 'Creating Your First Class' },
          { timeSeconds: 420, timeLabel: '07:00', title: 'The __init__ Constructor and self' },
          { timeSeconds: 680, timeLabel: '11:20', title: 'Instance Methods vs Class Methods' },
        ],
        keyTakeaways: [
          'Classes act as blueprints; objects are live instances created from those blueprints',
          '__init__ is the initializer that configures instance attributes upon creation',
          'self refers to the specific instance calling the method'
        ],
        alternativeVideos: DEFAULT_PYTHON_VIDEO.alternativeVideos
      };
    }
    return DEFAULT_PYTHON_VIDEO;
  }

  // SQL specific
  if (slug.includes('sql') || slug.includes('database')) {
    if (normTitle.includes('join')) {
      return {
        youtubeId: '9yeOJ0ZMUYw',
        title: 'SQL JOINs Tutorial - Visual Explanation',
        channel: 'Alex The Analyst',
        duration: '14 min 30 sec',
        description: 'Visual walkthrough of INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, and FULL JOIN with clear examples.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'Introduction to Joins' },
          { timeSeconds: 180, timeLabel: '03:00', title: 'Inner Join Explained' },
          { timeSeconds: 380, timeLabel: '06:20', title: 'Left vs Right Outer Joins' },
          { timeSeconds: 610, timeLabel: '10:10', title: 'Full Outer Join and Null Matching' },
        ],
        keyTakeaways: [
          'INNER JOIN returns only matching records from both tables',
          'LEFT JOIN returns all rows from the left table and matched rows from the right table',
          'Always join on primary and foreign key indexed columns for top query performance'
        ],
        alternativeVideos: DEFAULT_SQL_VIDEO.alternativeVideos
      };
    }
    return DEFAULT_SQL_VIDEO;
  }

  // Web Development
  if (slug.includes('web') || slug.includes('react') || slug.includes('js')) {
    if (normTitle.includes('react')) {
      return {
        youtubeId: 'bMknfKXIFA8',
        title: 'React.js Complete Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '5 hr 12 min',
        description: 'Comprehensive modern React course covering JSX, components, props, state with useState, and hooks.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'What is React & Component Architecture' },
          { timeSeconds: 900, timeLabel: '15:00', title: 'JSX Syntax Rules & Rendering Elements' },
          { timeSeconds: 2400, timeLabel: '40:00', title: 'Props: Passing Data to Components' },
          { timeSeconds: 4200, timeLabel: '1:10:00', title: 'useState Hook & Reactive UI Updates' },
          { timeSeconds: 6600, timeLabel: '1:50:00', title: 'Handling Events & Controlled Forms' },
        ],
        keyTakeaways: [
          'React uses a virtual DOM to perform lightning-fast UI reconciliations',
          'Components should be pure functions that render UI based on incoming props and local state',
          'useState triggers re-renders whenever state changes occur'
        ],
        alternativeVideos: DEFAULT_WEB_VIDEO.alternativeVideos
      };
    }
    if (normTitle.includes('javascript') || normTitle.includes('js')) {
      return {
        youtubeId: 'W6NZfCO5SIk',
        title: 'JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour',
        channel: 'Programming with Mosh',
        duration: '48 min 15 sec',
        description: 'Understand core JavaScript concepts: variables, constants, primitive types, functions, and arrays.',
        chapters: [
          { timeSeconds: 0, timeLabel: '00:00', title: 'What is JavaScript?' },
          { timeSeconds: 270, timeLabel: '04:30', title: 'Variables & Constants (let vs const)' },
          { timeSeconds: 750, timeLabel: '12:30', title: 'Primitive Types vs Reference Objects' },
          { timeSeconds: 1450, timeLabel: '24:10', title: 'Functions & Parameter Passing' },
        ],
        keyTakeaways: [
          'JavaScript provides dynamic interactivity to web applications',
          'Use const by default and let only when variables need to be reassigned',
          'Functions are first-class citizens that can be stored in variables or passed as arguments'
        ],
        alternativeVideos: DEFAULT_WEB_VIDEO.alternativeVideos
      };
    }
    return DEFAULT_WEB_VIDEO;
  }

  // Data Analytics
  if (slug.includes('analytics') || slug.includes('data')) {
    return DEFAULT_ANALYTICS_VIDEO;
  }

  // Default fallback
  return DEFAULT_PYTHON_VIDEO;
}
