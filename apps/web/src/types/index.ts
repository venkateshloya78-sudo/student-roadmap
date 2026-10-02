export type AuthProvider = 'local' | 'google';
export type UserRole = 'student' | 'admin' | 'content_editor' | 'market_analyst';
export type Degree = 'btech' | 'bsc' | 'bcom' | 'ba' | 'mtech' | 'msc' | 'other';
export type LearningStyle = 'visual' | 'reading' | 'hands_on' | 'video' | 'mixed';
export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'no_preference';
export type SkillCategory = 'technical' | 'soft' | 'domain' | 'tool';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillConfidence = 'low' | 'medium' | 'high';
export type RoadmapStatus = 'draft' | 'active' | 'archived';
export type PhaseStatus = 'not_started' | 'in_progress' | 'completed';
export type ItemStatus = 'not_started' | 'in_progress' | 'completed' | 'verified';
export type ItemType = 'skill' | 'resource' | 'project' | 'assessment' | 'milestone';
export type SeniorityLevel = 'entry' | 'mid' | 'senior';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  degree: Degree | null;
  branch: string | null;
  university: string | null;
  year: number | null;
  semester: number | null;
  graduation_year: number | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string;
  weekly_learning_hours: number | null;
  career_goal_text: string | null;
  learning_style: LearningStyle | null;
  profile_completed_at: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  description: string | null;
  difficulty: Difficulty;
  status: 'active' | 'deprecated';
}

export interface StudentSkill {
  id: string;
  skill_id: string;
  skill: Skill;
  self_rating: number | null;
  assessment_rating: number | null;
  evidence_rating: number | null;
  competency_score: number | null;
  confidence: SkillConfidence;
  source: string;
  last_verified_at: string | null;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CareerPath {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  industry_id: string;
  industry?: Industry;
}

export interface CareerRoleSkill {
  id: string;
  skill: Skill;
  importance: number;
  required_level: Difficulty;
}

export interface CareerRole {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  career_path_id: string;
  career_path?: CareerPath;
  industry_id: string;
  industry?: Industry;
  entry_level_experience_years: number;
  seniority_level: SeniorityLevel;
  education_requirements: Record<string, unknown>;
  status: 'active' | 'draft' | 'deprecated';
  required_skills?: CareerRoleSkill[];
}

export interface RoadmapItem {
  id: string;
  phase_id: string;
  type: ItemType;
  reference_id: string | null;
  title: string;
  description: string | null;
  estimated_hours: number | null;
  order_index: number;
  status: ItemStatus;
  ai_explanation: string | null;
  prerequisite_item_ids: string[];
  progress?: StudentProgress;
}

export interface RoadmapPhase {
  id: string;
  roadmap_id: string;
  phase_number: number;
  title: string;
  description: string | null;
  estimated_hours: number | null;
  status: PhaseStatus;
  items: RoadmapItem[];
}

export interface Roadmap {
  id: string;
  student_id: string;
  career_role_id: string;
  career_role?: Pick<CareerRole, 'id' | 'title' | 'slug'>;
  version: number;
  status: RoadmapStatus;
  weekly_hours_committed: number | null;
  target_completion_date: string | null;
  generated_at: string | null;
  phases: RoadmapPhase[];
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  roadmap_item_id: string;
  status: ItemStatus;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface OnboardingData {
  degree?: Degree;
  branch?: string;
  university?: string;
  year?: number;
  semester?: number;
  graduation_year?: number;
  career_role_id?: string;
  skills?: Array<{ skill_id: string; self_rating: number }>;
  learning_style?: LearningStyle;
  weekly_learning_hours?: number;
  target_completion_date?: string;
  career_goal_text?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
