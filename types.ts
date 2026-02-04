
export interface AssessmentScore {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
  c7: number;
}

export enum AssessmentType {
  SQ_CRITICAL = 'SQ_CRITICAL',
  EQ_AWARENESS = 'EQ_AWARENESS',
  LEARNING_ANXIETY = 'LEARNING_ANXIETY'
}

export interface Student {
  id: number;
  name: string;
  // Scores for each assessment type
  scores: {
    [key in AssessmentType]: AssessmentScore;
  };
}

export interface AssessmentMetadata {
  activityNumber: string;
  activityName: string;
  teacherName: string;
}

export enum GradeLevel {
  EXCELLENT = 'ดีเยี่ยม',
  GOOD = 'ดี',
  FAIR = 'พอใช้',
  IMPROVEMENT = 'ต้องปรับปรุง'
}

export interface SummaryStat {
  level: GradeLevel;
  count: number;
  percentage: number;
  description: string;
  minScore: number;
  maxScore: number;
}
