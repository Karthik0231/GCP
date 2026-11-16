export type BranchId =
  | 'all'
  | 'core'
  | 'networking'
  | 'compute'
  | 'storage-db'
  | 'containers'
  | 'hosting'
  | 'devops'
  | 'security'
  | 'observability'
  | 'ai-advanced'
  | 'finops';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Architect';

export type VerificationStatus = 'verified' | 'needs-review' | 'outdated' | 'deprecated' | 'unverified';

export interface ContentVerification {
  sourceReferences?: string[];
  lastVerifiedAt?: string;
  verificationStatus?: VerificationStatus;
}

export interface ConsoleStep {
  step: number;
  title: string;
  instruction: string;
  expectedResult?: string;
  navigation?: string;
  setting?: string;
  exampleValue?: string;
  why?: string;
  warning?: string;
  verification?: string;
}

export interface CliCommand {
  command: string;
  explanation: string;
  flags?: { flag: string; purpose: string }[];
  output?: string;
}

export interface CommonMistake {
  mistake: string;
  fix: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LabExercise {
  title: string;
  objective: string;
  tasks: string[];
  cleanupCommand?: string;
}

export interface TopicNode {
  id: string;
  stage: number;
  stageName: string;
  branch: BranchId;
  title: string;
  subtitle: string;
  level: DifficultyLevel;
  estimatedTime: string;
  prerequisites: string[]; // Topic IDs
  freeTierEligible: boolean;
  costWarning?: string;
  simpleExplanation: string;
  analogy: string;
  whyItExists: string;
  howItWorks: string;
  internalDetails: string;
  consoleSteps: ConsoleStep[];
  cliCommands: CliCommand[];
  terraformSnippet?: string;
  commonMistakes: CommonMistake[];
  securityImplications: string;
  quickRevision: string[]; // 5 essential bullet points
  quiz: QuizQuestion[];
  labTask: LabExercise;
  relatedTopics: string[];
  docUrl: string;
  lastVerified: string;
  sourceReferences?: string[];
  lastVerifiedAt?: string;
  verificationStatus?: VerificationStatus;
  learningObjectives?: string[];
  commonErrors?: string[];
  troubleshooting?: string[];
  expectedResults?: string[];
  securityConsiderations?: string[];
  costConsiderations?: string[];
}

export interface RoadmapStage {
  stage: number;
  name: string;
  description: string;
  level: DifficultyLevel;
  topics: TopicNode[];
}

export interface CommandLineItem {
  id: string;
  category: string;
  command: string;
  description: string;
  syntax: string;
  example: string;
  expectedOutput: string;
  isDestructive?: boolean;
  warning?: string;
  prerequisites?: string;
  permissions?: string;
  shell?: 'bash' | 'powershell' | 'cloud-shell' | 'terraform' | 'kubectl';
  commonErrors?: string[];
  troubleshooting?: string[];
  cleanup?: string;
  verificationStatus?: VerificationStatus;
  sourceReferences?: string[];
  lastVerifiedAt?: string;
}

export interface HandsOnLab {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  estimatedCost: string;
  freeTier: boolean;
  objective: string;
  prerequisites: string[];
  requiredApis: string[];
  consoleSteps: string[];
  consoleGuide?: ConsoleGuideStep[];
  cliSteps: string[];
  verificationChecklist: string[];
  cleanupSteps: string[];
  billingRequired?: boolean;
  requiredPermissions?: string[];
  possibleCharges?: string[];
  billingCaveats?: string[];
  setupSteps?: string[];
  verificationSteps?: string[];
  troubleshootingSteps?: string[];
  verificationStatus?: VerificationStatus;
  sourceReferences?: string[];
}

export interface ConsoleGuideStep {
  navigation: string;
  action: string;
  setting?: string;
  exampleValue?: string;
  why: string;
  expectedResult: string;
  warning?: string;
}

export interface LabProgress {
  activePhase: number;
  completedPhases: number[];
  completedVerificationItems: string[];
  updatedAt: string;
}

export interface TopicProgress {
  activeSection: 'console' | 'cli' | 'terraform';
  quizAnswers: Record<number, number>;
  completedExerciseSteps: number[];
  updatedAt: string;
}

export interface RealWorldProject {
  id: string;
  number: number;
  title: string;
  description: string;
  architectureSummary: string;
  servicesUsed: string[];
  difficulty: DifficultyLevel;
  productionRequirements: string[];
  folderStructure: string;
  implementationSteps: {
    step: number;
    title: string;
    detail: string;
    snippet?: string;
    lang?: string;
  }[];
  costEstimation: string;
  cleanupCommand: string;
  architecture?: string[];
  prerequisites?: string[];
  infrastructureSetup?: string[];
  consoleImplementation?: string[];
  cliImplementation?: string[];
  terraformImplementation?: string[];
  secretsManagement?: string[];
  networking?: string[];
  logging?: string[];
  monitoring?: string[];
  testing?: string[];
  deployment?: string[];
  rollback?: string[];
  verificationStatus?: VerificationStatus;
  sourceReferences?: string[];
}

export interface ArchitectureItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  nodes: {
    id: string;
    label: string;
    role: string;
    service: string;
    tier: string;
    techNotes: string;
  }[];
  flows: {
    from: string;
    to: string;
    label: string;
    protocol: string;
  }[];
  keyPrinciples: string[];
}

export interface InterviewPrepItem {
  id: string;
  category: string;
  level: DifficultyLevel;
  question: string;
  shortAnswer: string;
  deepDive: string;
  commonMistake: string;
  comparisonTable?: {
    title: string;
    colA: string;
    colB: string;
    rows: {
      feature: string;
      valA: string;
      valB: string;
    }[];
  };
}

export interface UserStats {
  completedTopicsCount: number;
  totalTopicsCount: number;
  currentLevelName: string;
  levelNumber: number;
  streak: number;
}

