import { CourseContent } from '@/types/course';

export const part2Content: CourseContent = {
  slug: 'part-2-statistics-analysts',
  phase: 1,
  part: 2,
  title: 'Statistics for Analysts',
  subtitle: 'Learn to extract patterns, reject random noise, and explain metrics to business leaders.',
  duration: '1 Week',
  aiHighlight: 'Use generative AI assistants to explain statistical outputs and translate p-values into plain business English.',
  skills: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Correlation Analysis'],
  tools: ['Excel', 'ChatGPT', 'Julius AI', 'ydata-profiling'],
  sections: [
    {
      id: 'intro',
      title: 'The Role of Statistics in Business',
      blocks: [
        {
          type: 'text',
          content: 'Statistics is the foundational framework behind every A/B test, financial model, and operational decision. You do not need a degree in pure mathematics. Rather, you need the standard structural capability to select tests, inspect distributions, and communicate results confidently.'
        },
        {
          type: 'info',
          category: 'tip',
          title: 'The Analyst Perspective',
          icon: '🎯',
          content: 'You are here to answer business questions, not write mathematical proofs. Every statistical test is a tool to translate random, noisy records into highly actionable insight portfolios.'
        }
      ]
    },
    {
      id: 'central',
      title: 'Measures of Central Tendency',
      blocks: [
        {
          type: 'text',
          content: 'Central tendency metrics isolate the "typical" value in your dataset. Choosing the wrong metric (e.g. reporting mean revenue in a highly skewed dataset) is a common failure point for junior data talent.'
        },
        {
          type: 'formula',
          name: 'Mean',
          category: 'Central Tendency',
          syntax: 'x̄ = (∑ x_i) / n',
          replaces: 'Excel: AVERAGE()',
          whatItDoes: 'Computes the mathematical average of a collection of values.',
          businessUse: 'Normally distributed sets such as physical products dimensions, standardized scores, or highly consistent process tracking.',
          example: {
            desc: 'Average handling time in a consistent customer queue:',
            formula: 'Dataset: [10, 12, 11, 13, 9, 1000] (outlier present)\nMean handles to 175.8 minutes — Highly misleading!',
          },
          vsOld: 'Fails to represent typical values when outliers exist.',
          aiPrompt: '"I have a customer handle duration dataset: [10, 12, 11, 13, 9, 1000]. Is the mathematical mean a helpful typical representation here? If not, what should I use?"'
        },
        {
          type: 'formula',
          name: 'Median',
          category: 'Central Tendency',
          syntax: 'Middle sorted value',
          replaces: 'Excel: MEDIAN()',
          whatItDoes: 'Extracts the exact physical middle value when records are sorted in ascending/descending layout.',
          businessUse: 'Highly skewed distributions such as company salary structures, house values, or retail transactional sizes.',
          example: {
            desc: 'Extracting middle value from the outlier dataset:',
            formula: 'Dataset: [10, 12, 11, 13, 9, 1000]\nMedian = 11.5 minutes — A perfect representation of standard handling times!',
          },
          vsOld: 'Robust to outliers because it evaluates coordinate position over absolute magnitudes.',
          aiPrompt: '"Write a detailed explanation of why tech giants use median customer lifetime value instead of mean for financial projections."'
        }
      ]
    },
    {
      id: 'dispersion',
      title: 'Measures of Dispersion (Spread)',
      blocks: [
        {
          type: 'text',
          content: 'Two datasets can share identical means but represent completely different distributions. Dispersion metrics measure how reliable, volatile, or consistent your values are.'
        },
        {
          type: 'visual',
          visualizationId: 'dispersion-comparison',
          title: 'Comparing Volatility (Team A vs. Team B)',
          data: {
            teamA: [48, 49, 50, 51, 52, 50, 50, 49, 51, 50],
            teamB: [20, 70, 35, 80, 15, 90, 40, 60, 25, 65]
          }
        },
        {
          type: 'formula',
          name: 'Standard Deviation (σ)',
          category: 'Dispersion',
          syntax: 'σ = √[ ∑ (x_i - μ)² / n ]',
          replaces: 'Excel: STDEV.S() / STDEV.P()',
          whatItDoes: 'Calculates the average physical distance values lie away from the central mean coordinate.',
          businessUse: 'Measuring stock market volatility, manufacturing tolerance limits, or customer response SLAs.',
          example: {
            desc: 'Average handling time volatility analysis:',
            formula: 'Team A Handle: Mean = 5 mins, StdDev = 1.1 (Consistent queue)\nTeam B Handle: Mean = 5 mins, StdDev = 25.6 (Highly unstable SLA)',
          },
          vsOld: 'Unlike variance, standard deviation is returned in the exact units of your raw data, making it directly communicable to managers.'
        }
      ]
    },
    {
      id: 'distributions',
      title: 'Probability Distributions',
      blocks: [
        {
          type: 'text',
          content: 'Probability distributions outline how occurrences group across a dataset. Identifying layout curves determines which statistical tests are technically correct.'
        },
        {
          type: 'visual',
          visualizationId: 'distribution-normal',
          title: 'Symmetric Normal Curve (Gaussian)',
          data: [2, 7, 18, 30, 22, 13, 6, 2]
        },
        {
          type: 'visual',
          visualizationId: 'distribution-right-skewed',
          title: 'Right-Skewed Distribution (Long Tail)',
          data: [28, 22, 18, 13, 8, 5, 4, 2]
        }
      ]
    },
    {
      id: 'hypothesis',
      title: 'Hypothesis Testing & A/B Testing',
      blocks: [
        {
          type: 'text',
          content: 'A/B testing is how modern corporations evaluate product modifications. Hypothesis testing provides the rigorous mathematical check to determine if a conversion rate bump is a real success or a random spike.'
        },
        {
          type: 'concept-table',
          headers: ['Statistical Test', 'Comparison Objective', 'Business Case'],
          rows: [
            ['Independent t-test', 'Compares means of exactly 2 separate groups', 'Email Campaign A conversions vs. Campaign B conversions'],
            ['Paired t-test', 'Compares means of the same group at two time intervals', 'Employee capability scores before vs. after formal training'],
            ['ANOVA (Analysis of Variance)', 'Compares means of 3 or more separate groups simultaneously', 'Average revenues across 4 distinct visual website designs'],
            ['Chi-Square Test', 'Compares category frequencies between variables', 'Is customer geographical region related to device preferences?']
          ]
        },
        {
          type: 'info',
          category: 'prompt',
          title: 'A/B Test Verification Prompt',
          icon: '🤖',
          content: '"I am running an A/B test with 10,000 users. Control conversion = 4.2%, Treatment conversion = 4.8%. Calculate the p-value, tell me if it is statistically significant at alpha = 0.05, and outline standard caveats."'
        }
      ]
    },
    {
      id: 'correlation',
      title: 'Correlation vs. Causation',
      blocks: [
        {
          type: 'text',
          content: 'Correlation metrics measure how strongly variables move together. They do NOT explain why they move together. A classic correlation pitfall: Ice cream sales are highly correlated with drowning rates. The missing link is Hot Summer Weather (a confounding variable).'
        },
        {
          type: 'concept-table',
          headers: ['r-value range', 'Relationship Tier', 'Interpretation'],
          rows: [
            ['0.9 to 1.0', 'Very Strong Positive', 'Almost perfectly rise and fall together'],
            ['0.7 to 0.9', 'Strong Positive', 'High trend sync'],
            ['0.3 to 0.5', 'Weak Positive', 'Loose upward slope'],
            ['-0.7 to -0.5', 'Moderate Negative', 'As one rises, the other moderately drops'],
            ['-1.0 to -0.9', 'Very Strong Negative', 'Almost perfectly move in opposite directions']
          ]
        }
      ]
    }
  ],
  quiz: [
    {
      q: 'A dataset has values: 2, 4, 4, 4, 5, 5, 7, 9. What is the MODE?',
      options: ['4', '5', '4.5', '9'],
      answer: 0,
      explanation: "Mode is the most frequently occurring value. '4' appears 3 times — more than any other value. Always check mode first in skewed datasets."
    },
    {
      q: 'Sales data has a mean of $5,000 but a median of $1,200. What does this tell you?',
      options: [
        'The data is normally distributed',
        'A few extremely high sales are pulling the mean up — use median to represent typical sales',
        'The median is wrong',
        'Standard deviation is low'
      ],
      answer: 1,
      explanation: 'When mean >> median, the data is right-skewed — a few large outliers inflate the mean. Median is more representative of the typical value in skewed distributions.'
    },
    {
      q: 'Your A/B test returns p-value = 0.03. Your significance threshold is α = 0.05. What do you conclude?',
      options: [
        'Fail to reject H₀ — no significant difference',
        'Reject H₀ — the difference is statistically significant',
        'The test is inconclusive',
        'You need more data'
      ],
      answer: 1,
      explanation: 'p-value (0.03) < α (0.05) → reject the null hypothesis. The result is statistically significant — the observed difference is unlikely to be due to chance.'
    }
  ]
};
