import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, courseSlug, partSlug } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI Mentor is undergoing upgrades. Please configure GEMINI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // 1. Fetch AI Mentor settings dynamically from the database
    const mentorContext = await db.aimentorcontext.findFirst();
    const basePrompt = mentorContext?.globalPrompt || "You are an AI Tech Mentor. Guide students using the Socratic method.";

    let specializedPrompt = "";
    let activeLessonDetails = "";

    // 2. Resolve specialized course persona dynamically
    if (courseSlug) {
      const course = await db.course.findUnique({
        where: { slug: courseSlug }
      });

      if (course) {
        specializedPrompt = `\n\nActive Course: ${course.title}\n`;
        
        switch (courseSlug) {
          case 'ai-data-analytics':
            specializedPrompt += "Domain Directives: Act as a SQL query auditor and Looker Studio / Tableau storytelling coach. Always write clear CTEs and explain analytical logic using business context.";
            break;
          case 'ai-web-development':
            specializedPrompt += "Domain Directives: Act as a Fullstack Software Engineer. Answer questions about React, Next.js App Router, Prisma ORM, REST APIs, and TypeScript. Provide structured, clean code blocks and explain execution flows.";
            break;
          case 'ai-digital-marketing':
            specializedPrompt += "Domain Directives: Act as a growth marketing consultant. Guide students on lead-generation funnels, ad-copy structures, metadata loops, and multi-channel attribution models.";
            break;
          case 'ai-data-science':
            specializedPrompt += "Domain Directives: Act as an ML engineer. Guide students on Pandas data cleaning, Scikit-learn random forests, predictive classifiers, and model interpretability using SHAP values.";
            break;
          case 'ai-graphic-design':
            specializedPrompt += "Domain Directives: Act as a UI/UX layout auditor. Answer questions about Figma components, auto-layouts, creative branding systems, custom SVGs, and vector design loops.";
            break;
          default:
            specializedPrompt += "Domain Directives: Guide students across dynamic technical and non-technical skillsets using high-fidelity Socratic mentoring.";
        }
      }
    }

    // 3. Resolve active lesson context dynamically from the database
    if (courseSlug && partSlug) {
      const partOrder = parseInt(partSlug.replace('part-', '')) || 1;
      const part = await db.part.findFirst({
        where: {
          order: partOrder,
          phase: {
            course: { slug: courseSlug }
          }
        },
        include: {
          lesson: {
            orderBy: { order: 'asc' }
          },
          phase: true
        }
      });

      if (part && part.lesson.length > 0) {
        // Feed the active milestone details into prompt context
        activeLessonDetails = `\n\nActive Milestone Context:\n- Phase: ${part.phase.title}\n- Part: ${part.title}\n`;
        part.lesson.forEach((l, idx) => {
          activeLessonDetails += `- Lesson ${idx + 1}: ${l.title} (Type: ${l.type})\n`;
        });
      }
    }

    // 4. Combine into final dynamic context-aware system prompt
    const finalSystemPrompt = `${basePrompt}${specializedPrompt}${activeLessonDetails}

Socratic Guidelines:
- Encourage critical thinking and analytical reasoning.
- Do NOT spoon-feed direct copy-paste solutions instantly; guide them step-by-step.
- Present clean, syntax-highlighted code blocks where helpful.
- Explain the WHY behind structural logic or query optimizations.`;

    // 5. Query Google Gemini AI Engine
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format chat history for Gemini API
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `Please act as my AI Socratic Mentor according to these dynamic directives: ${finalSystemPrompt}` }] },
        { role: 'model', parts: [{ text: "Understood. I am your context-aware Socratic AI Mentor, dynamically connected to your active course milestones. How can I guide you today?" }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({
      role: 'assistant',
      content: responseText
    });

  } catch (error: any) {
    console.error("AI Mentor Engine Error:", error);
    return NextResponse.json(
      { error: "AI Mentor connection failed. Please retry shortly." },
      { status: 500 }
    );
  }
}
