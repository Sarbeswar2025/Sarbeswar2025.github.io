// SEO and Performance optimizations
export const SEO_CONFIG = {
  siteName: 'Sarbeswar Panda Portfolio',
  siteUrl: 'https://sarbeswarpanda.me',
  description: 'Skilled Full-Stack Developer showcasing React, Node.js, and JavaScript projects. Explore my portfolio, skills, and professional journey.',
  keywords: [
    'Sarbeswar Panda',
    'Full Stack Developer',
    'React Developer',
    'Node.js',
    'JavaScript',
    'Portfolio',
    'Web Developer',
    'DSA',
    'Odisha Developer',
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack',
    'Software Engineer'
  ],
  author: 'Sarbeswar Panda',
  twitterHandle: '@sarbeswar_panda',
  linkedinUrl: 'https://linkedin.com/in/sarbeswar-panda',
  githubUrl: 'https://github.com/Sarbeswar2025'
};

// Lazy loading configuration
export const LAZY_LOADING_CONFIG = {
  rootMargin: '50px 0px',
  threshold: 0.01
};

// Performance optimization utilities
export const optimizeImage = (src: string, alt: string, loading: 'lazy' | 'eager' = 'lazy') => ({
  src,
  alt,
  loading,
  decoding: 'async' as const,
  fetchPriority: loading === 'eager' ? 'high' as const : 'auto' as const
});

// Social media links for structured data
export const SOCIAL_PROFILES = [
  'https://github.com/Sarbeswar2025',
  'https://linkedin.com/in/sarbeswar-panda',
  'https://twitter.com/sarbeswar_panda'
];

// Skills for structured data
export const SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'Python',
  'Java',
  'Git',
  'Docker',
  'AWS',
  'Full Stack Development',
  'Data Structures and Algorithms',
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'RESTful APIs',
  'GraphQL',
  'Responsive Design',
  'Agile Development'
];