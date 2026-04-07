export interface Project {
  id: string;
  title: string;
  image: string;
  tags: string[];
  year: string;

  badge?: {
    text: string;
    color: string;
  } | null;

  description: string;
  fullDescription: string;

  technologies: string[];

  liveUrl?: string | null;
  githubUrl?: string | null;
  frontendGithubUrl?: string | null;
  backendGithubUrl?: string | null;

  features: string[];

  role?: string;

  architecture?: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string[];
  };

  problemSolution?: {
    problem: string;
    solution: string;
  };

  metrics?: {
    label: string;
    value: string;
    description: string;
  }[];

  lessons?: string[];
}
