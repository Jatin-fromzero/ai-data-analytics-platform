import { CourseContent } from '@/types/course';

export const part1Content: CourseContent = {
  slug: 'part-1-intro-excel-fundamentals',
  phase: 1,
  part: 1,
  title: 'Intro to Analytics + Excel Fundamentals',
  subtitle: 'The absolute entry gate to analytical thinking and spreadsheet operations',
  duration: '1 Week',
  aiHighlight: 'Ask Microsoft Copilot to perform basic grid math and structure lists automatically.',
  skills: ['Data Thinking', 'Excel Basics', 'Grid Operations'],
  tools: ['Excel', 'Microsoft Copilot'],
  sections: [
    {
      id: 'intro',
      title: 'Introduction to Analytics',
      blocks: [
        {
          type: 'text',
          content: 'Welcome to your first step in the data analytics career pathway. Before moving into complex SQL databases or training machine learning models in Python, you must develop standard **Data Thinking** — the custom state of translating standard business inquiries into structured math models.'
        },
        {
          type: 'info',
          category: 'tip',
          title: 'The Golden Rule of Analytics',
          icon: '🎯',
          content: 'Never touch raw transactional records without duplicating them first. Always save your sources in clean sheets before applying formatting or transformations.'
        }
      ]
    },
    {
      id: 'excel-basics',
      title: 'Excel Grid Fundamentals',
      blocks: [
        {
          type: 'text',
          content: 'Spreadsheets are the ultimate universal translator for business data. Over 750 million people use Excel, and 80%+ of analyst job listings require spreadsheet proficiency.'
        },
        {
          type: 'code',
          language: 'excel',
          code: 'A1: The coordinate reference of column A, row 1\n=SUM(B2:B100): Excel sums everything in the referenced grid range\n=AVERAGE(C2:C50): Computes the statistical mean across column values',
          label: 'Essential Excel Reference'
        }
      ]
    }
  ],
  quiz: [
    {
      q: 'Which coordinate represents the intersection of column D and row 12 in an Excel spreadsheet?',
      options: ['12D', 'D12', '$D12', 'Column D, Row 12'],
      answer: 1,
      explanation: 'Excel coordinates are always referenced by column identifier letter first, followed by row number index: D12.'
    }
  ]
};
