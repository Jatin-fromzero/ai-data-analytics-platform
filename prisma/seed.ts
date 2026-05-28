// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding AI Tech Educare Platform...');

  // Create demo passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const demoPassword = await bcrypt.hash('demo123', 10);

  // 1. Create Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@analytics.com' },
    update: {},
    create: {
      id: 'usr_admin',
      email: 'admin@analytics.com',
      name: 'Jatin (CEO)',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      updatedAt: new Date(),
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@analytics.com' },
    update: {},
    create: {
      id: 'usr_student',
      email: 'student@analytics.com',
      name: 'Alex Student',
      passwordHash: studentPassword,
      role: 'STUDENT',
      updatedAt: new Date(),
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@analytics.com' },
    update: {},
    create: {
      id: 'usr_demo',
      email: 'demo@analytics.com',
      name: 'Demo User',
      passwordHash: demoPassword,
      role: 'DEMO',
      updatedAt: new Date(),
    },
  });

  console.log('Users configured successfully.');

  // 2. Create Courses Map
  const coursesData = [
    {
      slug: 'ai-data-analytics',
      title: 'AI-Powered Data Analytics',
      description: 'Master Cloud query pipelines, BigQuery analytics, executive Looker Studio dashboards, and AI-assisted SQL execution.',
      status: 'PUBLISHED' as const,
      phases: {
        create: [
          {
            title: 'Phase 1: Spreadsheets & Descriptive Stats',
            order: 1,
            parts: {
              create: [
                {
                  title: 'Part 1: Analytics Fundamentals in AI Era',
                  order: 1,
                  lessons: {
                    create: [
                      { 
                        title: 'Welcome to AI Analytics OS', 
                        type: 'VIDEO' as const, 
                        order: 1,
                        content: `# Welcome to the AI Tech Educare Platform!\n\nWelcome to your premium, AI-powered learning workspace. In this course, we will explore the intersection of technical analytics workflows and generative AI assistant technologies.\n\n> [!NOTE]\n> **Platform Tip**: You can access your Socratic AI Mentor at any time from the widget in the sidebar. Ask it questions about this lesson or debug your SQL queries live!\n\n### Core Objectives\n- Master cloud data warehouses with **BigQuery**.\n- Build scalable ETL pipelines using **dbt** and **Apache Airflow**.\n- Design enterprise-grade executive stories with **Tableau** and **Looker Studio**.\n\nLet's get started by entering the next lesson in the sidebar checklist!`
                      },
                      { 
                        title: 'Modern Descriptive Statistics', 
                        type: 'TEXT' as const, 
                        order: 2,
                        content: `# Modern Technical & Business Analytics\n\nData analytics is the discipline of cleaning, transforming, and modeling raw data to discover actionable insights that drive business decisions. In the modern era, analysts utilize generative AI to write queries and analyze datasets **10x faster**.\n\n## The 4 Tiers of Technical Analytics\n\n1. **Descriptive Analytics**: *What happened?*\n   - Example: Regional revenue dropped by 12% in Q3.\n   - Tools: SQL, Excel, Tableau.\n2. **Diagnostic Analytics**: *Why did it happen?*\n   - Example: Correlation analysis reveals drops are linked to a competitor's pricing pivot.\n   - Tools: Python Pandas EDA, SQL CTEs.\n3. **Predictive Analytics**: *What will happen?*\n   - Example: Forecast models anticipate demand will stabilize by Q1.\n   - Tools: Scikit-learn, XGBoost.\n4. **Prescriptive Analytics**: *What should we do?*\n   - Example: Trigger a 10% coupon retention campaign for at-risk client segments.\n   - Tools: Decision optimization, A/B testing.\n\n## Live SQL Code Blocks\n\nBelow is a standard business cohort query that groups transactions and calculates customer retention:\n\n\`\`\`sql\nWITH cohort_rows AS (\n  SELECT \n    user_id,\n    DATE_TRUNC(created_at, MONTH) as cohort_month,\n    amount\n  FROM billing_transactions\n)\nSELECT \n  cohort_month,\n  COUNT(DISTINCT user_id) as active_users,\n  SUM(amount) as gross_revenue\nFROM cohort_rows\nGROUP BY 1\nORDER BY 1 ASC;\n\`\`\`\n\n> [!IMPORTANT]\n> **Optimization Tip**: Always use CTEs (Common Table Expressions) rather than nested subqueries. This improves query readability and allows the database compiler to optimize the physical scan execution plan.\n\n---\n\n## 🧠 Interactive Practice Quiz\n\nLet's complete this brief review to test your analytics foundations:\n\n*Question 1*: A company notices sales dropped 30% last month and wants to know **WHY**. Which type of analytics do they need?\n- [ ] Descriptive Analytics\n- [x] Diagnostic Analytics\n- [ ] Predictive Analytics\n- [ ] Prescriptive Analytics`
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      slug: 'ai-digital-marketing',
      title: 'AI-Powered Digital Marketing',
      description: 'Build automated lead-gen funnels, programmatic ad scaling, copywriting pipelines, and cross-channel growth loops.',
      status: 'PUBLISHED' as const,
      phases: {
        create: [
          {
            title: 'Phase 1: Programmatic Ads & Funnels',
            order: 1,
            parts: {
              create: [
                {
                  title: 'Part 1: AI Marketing Strategies',
                  order: 1,
                  lessons: {
                    create: [
                      { title: 'Introduction to Generative Marketing', type: 'VIDEO' as const, order: 1 },
                      { title: 'Designing High-Conversion Landing Pages', type: 'TEXT' as const, order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      slug: 'ai-data-science',
      title: 'AI-Powered Data Science',
      description: 'Master algorithmic model building, regression/classification pipelines, neural network structures, and SHAP interpretability.',
      status: 'PUBLISHED' as const,
      phases: {
        create: [
          {
            title: 'Phase 1: Foundational Modeling',
            order: 1,
            parts: {
              create: [
                {
                  title: 'Part 1: Predictive Modeling Introduction',
                  order: 1,
                  lessons: {
                    create: [
                      { title: 'What is ML in the Era of LLMs?', type: 'VIDEO' as const, order: 1 },
                      { title: 'Supervised Learning Frameworks', type: 'TEXT' as const, order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      slug: 'ai-web-development',
      title: 'AI-Powered Web Development',
      description: 'Architect secure dynamic APIs, Next.js interactive portals, cloud middleware structures, and pair-programming loops.',
      status: 'PUBLISHED' as const,
      phases: {
        create: [
          {
            title: 'Phase 1: Fullstack Architecture Loops',
            order: 1,
            parts: {
              create: [
                {
                  title: 'Part 1: Next.js App Router Setup',
                  order: 1,
                  lessons: {
                    create: [
                      { title: 'Interactive Client vs Server Components', type: 'VIDEO' as const, order: 1 },
                      { title: 'Configuring secure REST API routes', type: 'TEXT' as const, order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      slug: 'ai-graphic-design',
      title: 'AI-Powered Graphic Design',
      description: 'Design premium graphic portfolios, dynamic UI prototypes, vectorized layout branding, and creative generative assets.',
      status: 'PUBLISHED' as const,
      phases: {
        create: [
          {
            title: 'Phase 1: UI/UX & Dynamic Prototypes',
            order: 1,
            parts: {
              create: [
                {
                  title: 'Part 1: Figma Layout Grids & Systems',
                  order: 1,
                  lessons: {
                    create: [
                      { title: 'Design Principles for High Tech Brands', type: 'VIDEO' as const, order: 1 },
                      { title: 'Dynamic Component Auto-Layouts', type: 'TEXT' as const, order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    }
  ];

  const dbCourses = [];
  for (const courseItem of coursesData) {
    const createdCourse = await prisma.course.upsert({
      where: { slug: courseItem.slug },
      update: {
        title: courseItem.title,
        description: courseItem.description,
      },
      create: {
        id: `crs_${courseItem.slug}`,
        slug: courseItem.slug,
        title: courseItem.title,
        description: courseItem.description,
        status: courseItem.status,
        updatedAt: new Date(),
        phase: {
          create: (courseItem.phases.create || []).map((phase, pIdx) => ({
            id: `ph_${courseItem.slug}_${pIdx + 1}`,
            title: phase.title,
            order: phase.order,
            updatedAt: new Date(),
            part: {
              create: (phase.parts.create || []).map((part, ptIdx) => ({
                id: `pt_${courseItem.slug}_${pIdx + 1}_${ptIdx + 1}`,
                title: part.title,
                order: part.order,
                updatedAt: new Date(),
                lesson: {
                  create: (part.lessons?.create || []).map((lesson, lIdx) => ({
                    id: `les_${courseItem.slug}_${pIdx + 1}_${ptIdx + 1}_${lIdx + 1}`,
                    title: lesson.title,
                    type: lesson.type,
                    order: lesson.order,
                    content: lesson.content || '',
                    updatedAt: new Date(),
                  }))
                }
              }))
            }
          }))
        }
      } as any,
    });
    dbCourses.push(createdCourse);
    console.log(`Course ${courseItem.title} seeded successfully.`);
  }

  // 3. Create initial unlock (enrollment) for the student for 'ai-data-analytics' only
  const mainCourse = dbCourses.find(c => c.slug === 'ai-data-analytics');
  if (mainCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: mainCourse.id,
        },
      },
      update: {},
      create: {
        id: `enr_${student.id}_${mainCourse.id}`,
        userId: student.id,
        courseId: mainCourse.id,
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });
    console.log(`Initial course enrollment unlocked for student for: ${mainCourse.title}`);
  }

  // 4. Create/Configure Settings
  await prisma.adminsettings.upsert({
    where: { id: 'default-settings' },
    update: {
      platformName: 'AI Tech Educare OS',
      supportEmail: 'support@educare.com',
      updatedAt: new Date(),
    },
    create: {
      id: 'default-settings',
      platformName: 'AI Tech Educare OS',
      supportEmail: 'support@educare.com',
      updatedAt: new Date(),
    },
  });

  await prisma.aimentorcontext.upsert({
    where: { id: 'default-mentor' },
    update: {
      globalPrompt: 'You are an AI Tech Mentor. Guide students using the Socratic method across data, engineering, web dev, and digital marketing.',
      updatedAt: new Date(),
    },
    create: {
      id: 'default-mentor',
      globalPrompt: 'You are an AI Tech Mentor. Guide students using the Socratic method across data, engineering, web dev, and digital marketing.',
      lessonAware: true,
      codeVerify: true,
      socraticMethod: true,
      updatedAt: new Date(),
    },
  });

  console.log('System & AI Mentor settings configured successfully.');
  console.log('All seeding actions completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
