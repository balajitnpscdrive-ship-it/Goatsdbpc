
export enum Department {
  BASIC = 'Basic Science and Humanities',
  MECH = 'Mechanical Engineering',
  EEE = 'Electrical and Electronics Engineering',
  CIVIL = 'Civil Engineering',
  CSE = 'Computer Science Engineering',
  ECE = 'Electronics and Communication Engineering',
  ADMIN = 'Admin'
}

export enum AcademicYear {
  FIRST = 'First Year',
  SECOND = 'Second Year',
  THIRD = 'Third Year'
}

export enum House {
  BOSCO = 'Bosco',
  SAVIO = 'Savio',
  RUVA = 'Ruva',
  THOMAS = 'Thomas'
}

export enum Category {
  ATTENDANCE = 'Attendance',
  CAT_EXAM = 'CAT Exam',
  EXTRA_ACTIVITIES = 'Extra Activities',
  DISCIPLINE = 'Discipline',
  COLLEGE_EVENTS = 'College Events',
  CUSTOM = 'Custom'
}

export interface PointLog {
  id: string;
  studentName: string;
  house: House;
  points: number;
  category: Category | string;
  department: Department;
  year: AcademicYear;
  timestamp: number;
  type: 'addition' | 'subtraction';
}

export interface WeeklyWinner {
  weekEndDate: string;
  winner: House;
  runner: House;
  secondRunner: House;
  scores: Record<House, number>;
}

export interface SystemState {
  weeklyPoints: Record<House, number>;
  championshipPoints: Record<House, number>;
  history: PointLog[];
  weeklyWinners: WeeklyWinner[];
  lastResetTimestamp: number;
  studentNames: Partial<Record<Department, string[]>>;
}
