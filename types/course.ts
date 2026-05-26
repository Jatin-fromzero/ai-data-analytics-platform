// ═══════════════════════════════════════════════════════════════
// ENTERPRISE EDUCATIONAL CONTENT TYPE SYSTEM
// ═══════════════════════════════════════════════════════════════
// Supports: 18 block types, dynamic routing, CMS integration,
// database migration, multi-instructor, progress tracking.
// Designed for 100+ courses across tech and non-tech education.
// ═══════════════════════════════════════════════════════════════

// ── COLOR TOKENS ──────────────────────────────────────────────
// Semantic color identifiers for consistent theming across blocks.
// Components map these to Tailwind classes, not raw hex values.
export type AccentColor =
  | 'blue'      // #4FC3F7 — Lookups, SQL, primary
  | 'green'     // #81C784 — Aggregate, data, success
  | 'yellow'    // #FFD54F — Warning, logic, highlight
  | 'orange'    // #FF8A65 — Performance, error-adjacent
  | 'purple'    // #CE93D8 — AI, advanced, logic
  | 'pink'      // #F48FB1 — Cleaning, UX, tips
  | 'lime'      // #B2FF59 — Python, Phase 3
  | 'gold'      // #FFD700 — Career, Phase 6
  | 'teal'      // #80DEEA — ORDER BY, secondary SQL
  | 'indigo'    // #6E40C9 — GitHub Copilot, AI code
  | 'coral'     // #FF6B35 — Brand accent
  | 'red';      // #FF6464 — Errors, critical warnings

// ── BLOCK TYPES (Discriminated Union) ─────────────────────────
// Every educational content pattern is represented as a typed block.
// The `type` field is the discriminant for exhaustive switch/case.

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. TEXT — Rich prose with inline markdown
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface TextBlock {
  type: 'text';
  /** Markdown-flavored text: **bold**, `code`, - list items */
  content: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. CALLOUT — Tip / Warning / AI Prompt / Insight boxes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface CalloutBlock {
  type: 'callout';
  category: 'tip' | 'warning' | 'prompt' | 'insight' | 'important' | 'note';
  title?: string;
  icon?: string;
  /** Markdown-flavored content */
  content: string;
  color?: AccentColor;
}

export interface InfoBlock {
  type: 'info';
  category: 'tip' | 'warning' | 'prompt' | 'insight' | 'important' | 'note';
  title?: string;
  icon?: string;
  content: string;
  color?: AccentColor;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. FORMULA — Excel/SQL/Python formula deep-dive card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface FormulaBlock {
  type: 'formula';
  name: string;
  category: string;
  color?: AccentColor;
  syntax: string;
  replaces?: string;
  whatItDoes: string;
  businessUse: string;
  example: {
    desc: string;
    formula: string;
    notes?: string;
  };
  vsOld?: string;
  aiPrompt?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. CONCEPT TABLE — Headers + rows reference table
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface ConceptTableBlock {
  type: 'concept-table';
  title?: string;
  headers: string[];
  rows: string[][];
  /** Optional per-row color for the first column */
  rowColors?: AccentColor[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. CODE — Syntax-highlighted code block
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface CodeBlock {
  type: 'code';
  language: 'sql' | 'python' | 'excel' | 'javascript' | 'bash' | 'dax' | 'json' | 'yaml';
  code: string;
  label?: string;
  /** Optional annotation explaining key lines */
  annotation?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. VISUAL — Data visualization (distributions, charts)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface VisualBlock {
  type: 'visual';
  visualizationId: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. ACCORDION — Expandable detail panels
// Used for: AI tools, window functions, CTE patterns, formulas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface AccordionItem {
  title: string;
  /** Subtitle shown when collapsed */
  preview?: string;
  icon?: string;
  color?: AccentColor;
  /** Each detail section has a label and content */
  details: {
    label: string;
    /** Markdown or plain text */
    content: string;
    /** Optional: render content as code block */
    isCode?: boolean;
    codeLanguage?: CodeBlock['language'];
  }[];
}

export interface AccordionBlock {
  type: 'accordion';
  title?: string;
  items: AccordionItem[];
  /** Allow only one item open at a time? Default true */
  singleOpen?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. STEPS — Numbered step-by-step instruction sequence
// Used for: PivotTable builder, environment setup, workflows
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface StepItem {
  step: string;
  title: string;
  description: string;
  tip?: string;
  code?: string;
  codeLanguage?: CodeBlock['language'];
  color?: AccentColor;
}

export interface StepsBlock {
  type: 'steps';
  title?: string;
  steps: StepItem[];
  /** If true, renders with completion checkboxes (client-side state) */
  trackable?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. COMPARISON — Side-by-side concept/code comparison
// Used for: GROUP BY vs Window, CTE before/after, bad vs good
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface ComparisonBlock {
  type: 'comparison';
  title?: string;
  left: {
    label: string;
    content: string;
    isCode?: boolean;
    codeLanguage?: CodeBlock['language'];
    color?: AccentColor;
  };
  right: {
    label: string;
    content: string;
    isCode?: boolean;
    codeLanguage?: CodeBlock['language'];
    color?: AccentColor;
  };
  /** Optional explanatory note below the comparison */
  note?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. PRACTICE — Exercise with scenario, hint, and solution
// Used for: SQL practice queries, Python exercises
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface PracticeItem {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  /** Business scenario / context */
  scenario: string;
  /** Hint for the learner */
  hint: string;
  /** Full solution code */
  solution: string;
  solutionLanguage?: CodeBlock['language'];
  /** Expected output columns or description */
  expectedOutput?: string;
  color?: AccentColor;
}

export interface PracticeBlock {
  type: 'practice';
  title?: string;
  exercises: PracticeItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. DATASET — Inline tabular dataset with schema + preview
// Used for: RetailCo 40-row dataset, sample data for exercises
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface DatasetColumn {
  name: string;
  dataType: 'Text' | 'Number' | 'Date' | 'Boolean';
  description: string;
  color?: AccentColor;
}

export interface DatasetBlock {
  type: 'dataset';
  title: string;
  description?: string;
  columns: DatasetColumn[];
  /** Preview rows (first N rows of the dataset) */
  previewRows: Record<string, string | number>[];
  /** Total row count in the full dataset */
  totalRows: number;
  /** Optional download URL or inline data identifier */
  downloadId?: string;
  /** Optional computed statistics to display */
  stats?: {
    label: string;
    value: string;
    color?: AccentColor;
    note?: string;
  }[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. TASK — Graded capstone task with checklist + AI prompts
// Used for: Capstone projects, assessment deliverables
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface TaskItem {
  id: string;
  title: string;
  color?: AccentColor;
  weight: number;
  objective: string;
  steps: string[];
  aiPrompts: string[];
  deliverable: string;
  rubric: string[];
}

export interface TaskBlock {
  type: 'task';
  title?: string;
  tasks: TaskItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. RUBRIC — Self-assessment scoring grid
// Used for: Capstone marking, competency assessments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface RubricRow {
  task: string;
  maxScore: number;
  criteria: string;
}

export interface RubricBlock {
  type: 'rubric';
  title?: string;
  rows: RubricRow[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. FLASHCARD — Q&A review flip cards
// Used for: Phase review sessions, spaced repetition
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface FlashcardItem {
  question: string;
  answer: string;
}

export interface FlashcardBlock {
  type: 'flashcard';
  title?: string;
  cards: FlashcardItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. AI TOOL — AI tool reference card with prompts + warnings
// Used for: ChatGPT, Copilot, Julius AI, BigQuery Gemini, etc.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface AIToolItem {
  name: string;
  icon: string;
  color?: AccentColor;
  type?: string;
  description: string;
  /** How to use this tool */
  howToUse?: string;
  /** Best use cases */
  bestFor?: string;
  /** Setup instructions */
  setup?: string;
  /** Example prompts / code */
  prompts: string[];
  /** Warning about limitations */
  warning?: string;
}

export interface AIToolBlock {
  type: 'ai-tool';
  title?: string;
  tools: AIToolItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16. WORKFLOW — Numbered process/workflow steps with rationale
// Used for: AI statistics workflow, SQL analysis workflow
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface WorkflowStep {
  step: string;
  action: string;
  rationale: string;
}

export interface WorkflowBlock {
  type: 'workflow';
  title?: string;
  color?: AccentColor;
  steps: WorkflowStep[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 17. STAT GRID — KPI / metric card grid
// Used for: Dataset quick stats, performance metrics, key numbers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface StatItem {
  label: string;
  value: string | number;
  note?: string;
  color?: AccentColor;
}

export interface StatGridBlock {
  type: 'stat-grid';
  title?: string;
  stats: StatItem[];
  /** Optional: number of columns (default: auto-fill, min 200px) */
  columns?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 18. OVERVIEW CARDS — Section navigation / overview grid
// Used for: "What You'll Learn" overviews, section entry cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface OverviewCardItem {
  icon: string;
  title: string;
  description: string;
  color?: AccentColor;
  /** Optional: link to a section within the lesson */
  targetSectionId?: string;
}

export interface OverviewCardsBlock {
  type: 'overview-cards';
  title?: string;
  cards: OverviewCardItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISCRIMINATED UNION — All Block Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type Block =
  | TextBlock
  | CalloutBlock
  | InfoBlock
  | FormulaBlock
  | ConceptTableBlock
  | CodeBlock
  | VisualBlock
  | AccordionBlock
  | StepsBlock
  | ComparisonBlock
  | PracticeBlock
  | DatasetBlock
  | TaskBlock
  | RubricBlock
  | FlashcardBlock
  | AIToolBlock
  | WorkflowBlock
  | StatGridBlock
  | OverviewCardsBlock;

/** All possible block type discriminants — for exhaustive checks */
export type BlockType = Block['type'];

// ═══════════════════════════════════════════════════════════════
// SECTION — A named group of blocks within a lesson
// ═══════════════════════════════════════════════════════════════
export interface Section {
  id: string;
  title: string;
  /** Optional: section accent color for nav highlighting */
  color?: AccentColor;
  blocks: Block[];
}

// ═══════════════════════════════════════════════════════════════
// QUIZ — End-of-lesson knowledge check
// ═══════════════════════════════════════════════════════════════
export interface QuizQuestion {
  q: string;
  options: string[];
  /** 0-indexed correct option */
  answer: number;
  explanation: string;
}

// ═══════════════════════════════════════════════════════════════
// COURSE CONTENT — Top-level lesson definition
// ═══════════════════════════════════════════════════════════════
export interface CourseContent {
  slug: string;
  phase: number;
  part: number;
  title: string;
  subtitle: string;
  duration: string;
  /** Phase accent color for theming */
  accentColor?: AccentColor;
  /** One-liner AI integration highlight */
  aiHighlight?: string;
  /** Skills taught in this lesson */
  skills: string[];
  /** Tools used in this lesson */
  tools: string[];
  /** Tags shown as badges (e.g. "~5 hours", "6 window functions") */
  tags?: string[];
  /** Sections containing the lesson blocks */
  sections: Section[];
  /** End-of-lesson quiz questions */
  quiz: QuizQuestion[];
  /** Preview of the next part for continuity */
  nextPartPreview?: {
    title: string;
    description: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// COURSE METADATA — For registry, navigation, and progress
// ═══════════════════════════════════════════════════════════════
export interface PhaseMetadata {
  phase: number;
  title: string;
  weeks: string;
  color: AccentColor;
  icon: string;
  parts: {
    part: number;
    slug: string;
    title: string;
    tools: string[];
    keyTopics: string;
  }[];
  capstone: string;
}

// ═══════════════════════════════════════════════════════════════
// ACCENT COLOR MAPPING — For components to resolve tokens
// ═══════════════════════════════════════════════════════════════
export const ACCENT_COLORS: Record<AccentColor, { hex: string; tw: string; twBorder: string; twBg: string; twText: string }> = {
  blue:    { hex: '#4FC3F7', tw: 'sky',     twBorder: 'border-sky-400/30',    twBg: 'bg-sky-400/8',     twText: 'text-sky-400'    },
  green:   { hex: '#81C784', tw: 'emerald', twBorder: 'border-emerald-400/30', twBg: 'bg-emerald-400/8', twText: 'text-emerald-400' },
  yellow:  { hex: '#FFD54F', tw: 'amber',   twBorder: 'border-amber-400/30',  twBg: 'bg-amber-400/8',   twText: 'text-amber-400'  },
  orange:  { hex: '#FF8A65', tw: 'orange',  twBorder: 'border-orange-400/30', twBg: 'bg-orange-400/8',  twText: 'text-orange-400' },
  purple:  { hex: '#CE93D8', tw: 'purple',  twBorder: 'border-purple-400/30', twBg: 'bg-purple-400/8',  twText: 'text-purple-400' },
  pink:    { hex: '#F48FB1', tw: 'pink',    twBorder: 'border-pink-400/30',   twBg: 'bg-pink-400/8',    twText: 'text-pink-400'   },
  lime:    { hex: '#B2FF59', tw: 'lime',    twBorder: 'border-lime-400/30',   twBg: 'bg-lime-400/8',    twText: 'text-lime-400'   },
  gold:    { hex: '#FFD700', tw: 'yellow',  twBorder: 'border-yellow-500/30', twBg: 'bg-yellow-500/8',  twText: 'text-yellow-500' },
  teal:    { hex: '#80DEEA', tw: 'cyan',    twBorder: 'border-cyan-400/30',   twBg: 'bg-cyan-400/8',    twText: 'text-cyan-400'   },
  indigo:  { hex: '#6E40C9', tw: 'violet',  twBorder: 'border-violet-500/30', twBg: 'bg-violet-500/8',  twText: 'text-violet-500' },
  coral:   { hex: '#FF6B35', tw: 'brand',   twBorder: 'border-brand/30',      twBg: 'bg-brand/8',       twText: 'text-brand'      },
  red:     { hex: '#FF6464', tw: 'red',     twBorder: 'border-red-500/30',    twBg: 'bg-red-500/8',     twText: 'text-red-400'    },
};

/** Helper to get accent color classes. Falls back to brand if undefined. */
export function getAccentClasses(color?: AccentColor) {
  return ACCENT_COLORS[color ?? 'coral'];
}
