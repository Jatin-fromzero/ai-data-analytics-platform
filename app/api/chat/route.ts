import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are an elite AI Career Mentor for a premium Data Analytics platform called AI AnalyticsHub. 
Your goal is to guide students from zero to job-ready data analysts. 
You are knowledgeable about SQL, Python, Tableau, Cloud Databases (BigQuery), AI Tools (Gemini, Copilot, ChatGPT), and Modern Data Engineering (dbt, Airflow, Vector DBs).
Keep your answers concise, encouraging, professional, and actionable. 
Use markdown for formatting. If you suggest a path, reference the 16-week curriculum (which includes Excel/Stats, SQL, Python, BI, Data Engineering, and Portfolio building).`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a simulated response if API key is not yet provided
      return NextResponse.json({
        role: 'assistant',
        content: "I am currently undergoing upgrades and am temporarily unavailable. Please check back soon!"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5-flash for fast, high-quality responses

    // Format history for Gemini API
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `Please act as my AI Career Mentor according to this system prompt: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: "Understood. I am your elite AI Career Mentor for AI AnalyticsHub. How can I help you today?" }] },
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

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response. Please try again later." },
      { status: 500 }
    );
  }
}
